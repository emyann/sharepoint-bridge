define(['./module'], function(controllers) {
    'use strict';

    controllers.controller('SignupCtrl', ['$scope', 'securityService', '$location', 'nwService','$modalInstance','repositoryUrl',
        function($scope, securityService, $location, nwService,$modalInstance,repositoryUrl) {


            console.log("Repository URL: ",repositoryUrl);

            var path = require('path'),
                fs = require('fs'),
                urlparse=require('url').parse;

                $scope.repositoryUrl= repositoryUrl || "";


            securityService.hasValidToken().then(function(hasToken) {
                $scope.authenticated = hasToken;
            });


            $scope.authenticate = function() {
                console.log("Repository URL",$scope.repositoryUrl);
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
                console.log("credentials submitted");
                
                var resourceEndpoint = urlparse(repositoryUrl).protocol + "//"+urlparse(repositoryUrl).host;
                securityService.authenticateUser(username, password,resourceEndpoint)
                    .then(function(resp) {
                       // $modalInstance.close(resp);
                       $scope.$close(resp);
                        console.log("security Service: authenticateUser", resp);
                    }, function(err) {
                        console.dir(err);
                    });
            };

        }
    ]);
});
