define(['./module'], function(controllers) {
    'use strict';

    controllers.controller('WorkspaceCtrl', ['$scope', '$modal', 'securityService', '$location', 'db', 'Repository','$log',
        function($scope, $modal, securityService, $location, db, Repository,$log) {
            var path = require('path'),
                fs = require('fs'),
                urlparse = require('url').parse;
               

            $scope.getFiles = function() {
                this.files = [];
                var env = process.env;
                var workspace = path.join(env.SystemDrive, env.HOMEPATH, '\\Documents\\Supinfo');
                this.files = fs.readdirSync(workspace);
                console.log(this.files);
            };

            //$scope.getFiles();

            $scope.addRepository = function() {
                Repository.count(function(err, count) {
                    console.log("Detected %d repositories already in the database", count);
                });
                //console.log("signup",SignupCtrl);
                var modalInstance = $modal.open({
                    templateUrl: path.resolve("./views/signup.html"),
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });

                //Check if repository already exists
                Repository.findOne({
                    url: $scope.repositoryUrl
                }, function(err, repository) {
                    if (err) {
                        throw err;
                    } else {
                        if (!repository) {
                            var goToLogin = !checkCookiesForUrl(Repository, $scope.repositoryUrl);
                            if (goToLogin) {

                            }
                            console.log($scope.repositoryUrl);
                            var repository = new Repository({
                                title: "",
                                url: $scope.repositoryUrl
                            });
                        }
                    }
                });




            };

            var checkCookiesForUrl = function(Repository, url) {
                return true;
            }

        }
    ]);
});
