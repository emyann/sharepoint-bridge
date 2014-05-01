define(['./module', '_'], function(services) {
    'use strict';

    services.service('securityService', ['$q', 'sharepointService',
        function($q, sharepointService) {

            var fs = require('fs'),
                path = require('path');

            this.hasValidToken = function() {
                return $q.when(true);
            };

            this.authenticateUser = function(username, password,endpoint) {

                var params = {
                    username: username,
                    password: password,
                    endpoint: endpoint
                };

                console.log("Authentication Parameters: ",username,endpoint);
                return sharepointService.getCookies(params)
                    .then(function(response) {
                        console.log("Authentication Response",response);
                        return response;
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
