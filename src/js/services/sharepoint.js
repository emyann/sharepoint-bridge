define(['./module', '_'], function(services, _) {
    'use strict';

    services.service('sharepointService', ['$q',
        function($q) {

            /** IMPORTS **/
            var fs = require('fs'),
                path = require('path'),
                https = require('https'),
                http = require('http'),
                urlparse = require('url').parse,
                xml2js = require('xml2js'),
                request = require('request');

                https.globalAgent.options.secureProtocol = 'SSLv3_method';

            /** IMPORTS **/


            /** INTERNAL MEMBERS **/
            var _token = ""; // SAML Token get from STS 
            var _targetService = "https://supinfocom.sharepoint.com/_forms/default.aspx?wa=wsignin1.0"; // Global variable to delete
            var _secureTokenService = "https://login.microsoftonline.com/extSTS.srf";
            /** INTERNAL MEMBERS **/

            /** PRIVATE FUNCTIONS **/
            /* Create SOAP ENVELOPE with user's credentials using a saved template for handshake with Microsoft Secure Token Service (STS) */
            var buildSamlRequest = function(params) {
                var key,
                    soapTmplFile = "soapEnv-Template.xml"; // get the soap template for request SAML
                var soapTmpl = fs.readFileSync(path.resolve('./resources', soapTmplFile), "utf8");
                for (key in params) {
                    soapTmpl = soapTmpl.replace('[' + key + ']', params[key]);
                }
                return $q.when(soapTmpl);
            };

            var parseXml = function(xml, callback) {
                var parser = new xml2js.Parser({
                    emptyTag: '', // use empty string as value when tag empty
                    explicitArray: false
                });

                parser.on('end', function(js) {
                    callback && callback(js)
                });
                parser.parseString(xml);
            };

            /* Request Token from Microsoft Secure Token Service*/
            var requestToken = function(params) {
                var _self = this;
                var deferred = $q.defer();

                // construct soap env for requesting token
                buildSamlRequest(params).then(function(samlSoapRequest) {
                    var options = {
                        url: _secureTokenService,
                        body: samlSoapRequest,
                        // proxy: "http://127.0.0.1:8888"
                    };
                    request.post(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var xml = body;

                            parseXml(xml, function(soapResponseObj) {
                                var bodyElements = soapResponseObj['S:Envelope']['S:Body'];
                                if (bodyElements['S:Fault']) {
                                    var error = bodyElements['S:Fault']['S:Detail']['psf:error']['psf:internalerror']['psf:text'];
                                    deferred.reject(error);
                                } else {
                                    // extract token
                                    _token = bodyElements['wst:RequestSecurityTokenResponse']['wst:RequestedSecurityToken']['wsse:BinarySecurityToken']['_'];
                                    deferred.resolve(_token);
                                }
                            });
                        } else {
                            deferred.reject(error.message);
                        }


                    });
                });

                return deferred.promise;
            };

            var submitToken = function(token) {
                var deferred = $q.defer();
                // var options = {
                //     host: '127.0.0.1',
                //     method: 'POST',
                //     port: '8888',
                //     path: "https://supinfocom.sharepoint.com/_forms/default.aspx?wa=wsignin1.0",
                //     headers: {
                //         'Content-Length': token.length,
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //         'host': urlparse(_targetService).host
                //     }
                // };
               
                 var options = {
                    host: urlparse(_targetService).host,
                    method: 'POST',
                    path: urlparse(_targetService).path,
                    headers: {
                        'Content-Length': token.length,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                console.log("Token Submission Parameters: ", options);
                var req = https.request(options, function(res) {
                    // console.log('STATUS: ' + res.statusCode);
                    // console.log('HEADERS: ' + JSON.stringify(res.headers));

                    res.setEncoding('utf8');
                    var cookies = parseCookies(res);
                    setCookiesForSubsequentCalls(cookies);

                    deferred.resolve("Access Granted");

                    // res.on('data', function(chunk) {
                    //     console.log('BODY: ' + chunk);
                    // });
                });

                req.on('error', function(e) {                    
                    console.log('problem with request: ' + e.message);
                    deferred.reject("Something is wrong with authentication: "+ e.message);
                });

                req.write(token);
                req.end();


                return deferred.promise;

            };

             var setCookiesForSubsequentCalls = function(cookies) {
                var j = request.jar();
                console.log("Cookies for secure communications: ",cookies);

                j.add(request.cookie('FedAuth=' + cookies['FedAuth'], "https://supinfocom.sharepoint.com"));
                j.add(request.cookie('rtFa=' + cookies['rtFa'], "https://supinfocom.sharepoint.com"));

                var req = request.defaults({
                    jar: j
                });
            };

            var parseCookies = function(response) {
               var list = {},
                    rc = response.headers['set-cookie'];

                rc && rc.forEach(function(cookie) {
                    var parts = cookie.split('=');
                    list[parts.shift().trim()] = unescape(parts.join('='));
                });

                return list;
            };
            /** private functions **/

            /** public functions **/
            this.getCookies = function(params) {
                return requestToken(params).then(function(token) {
                    console.log("Token Issued: ", token);
                    return submitToken(token);
                }, function(reason) {
                   return reason;
                });

                // return $q.when(true);
            };


            /** public functions **/

        }
    ]);
});
