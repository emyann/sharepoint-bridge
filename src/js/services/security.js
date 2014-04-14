define(['./module', '_'], function(services) {
    'use strict';

    services.service('securityService', ['$q', 'sharepointService',
        function($q, sharepointService) {

            var fs = require('fs'),
                path = require('path');

            this.hasValidToken = function() {
                return $q.when(true);
            };

            this.authenticateUser = function(username, password) {

                var params = {
                    username: username,
                    password: password,
                    endpoint: "https://supinfocom.sharepoint.com/"
                };
                return sharepointService.getCookies(params)
                    .then(function(token) {
                        console.log("token",token);
                        return token;
                    });

            };

            this.getUserInfos = function() {
                // Fake user information. Just a promise resolving to a dummy user object
                return $q.when({
                    name: "UserName"
                });
            };

        }
    ]);
});
