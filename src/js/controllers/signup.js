define(['./module'], function(controllers) {
    'use strict';

    controllers.controller('SignupCtrl', ['$scope', 'securityService', '$location', 'nwService',
        function($scope, securityService, $location, nwService) {

            var path = require('path'),
                fs = require('fs');


            securityService.hasValidToken().then(function(hasToken) {
                $scope.authenticated = hasToken;
            });


            $scope.authenticate = function() {
                var username = this.username;
                var password = this.password;

                //Purpose for test only
                if (!(username || password)) {
                    if ((fs.existsSync || path.existsSync)('./resources/credentials.json')) {
                        var credentials = JSON.parse(fs.readFileSync(path.resolve('./resources/credentials.json')));
                        username = credentials.username;
                        password = credentials.password;
                    }

                }
                console.log(username,password);

                securityService.authenticateUser(username, password)
                    .then(function(resp) {
                        console.log("security Service: authenticateUser", resp);
                    }, function(err) {
                        console.dir(err);
                    });
            };

        }
    ]);
});
