define(['./module','_'], function(controllers,_) {
    'use strict';

    controllers.controller('WorkspaceCtrl', ['$scope', '$modal', 'securityService', '$location', 'db', 'Repository', '$log',
        function($scope, $modal, securityService, $location, db, Repository, $log) {

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

            $scope.getFiles();

            $scope.addRepository = function() {
                Repository.count(function(err, count) {
                    console.log("Detected %d repositories already in the database", count);
                });

                Repository.find({},null,function(err,repositories){
                   _.each(repositories,function(){
                    console.log("args repo:",arguments);
                   });
                });



                //Check if repository already exists
                Repository.findOne({
                    url: $scope.repositoryUrl
                }, function(err, repository) {
                    if (err) {
                        throw err;
                    } else {
                        if (!repository) {
                            var goToLogin = !checkCookiesForUrl(Repository, $scope.repositoryUrl); // change checkCookies for a method into securityService as hasValidToken
                            if (goToLogin) {
                              processLoginWorkflow();
                            }
                            var repository = new Repository({
                                title: "",
                                url: $scope.repositoryUrl
                            });
                        }
                    }
                });




            };

            $scope.browseRepository=function(){
                
            }
            var checkCookiesForUrl = function(Repository, url) {
                return false;
            };

            var processLoginWorkflow = function() {
                  console.log("Repository URL before Modal",$scope.repositoryUrl);
                var signupModal = $modal.open({
                    templateUrl: path.resolve("./views/signup.html"),
                    controller: 'SignupCtrl',
                    resolve: {
                        repositoryUrl:function(){ return $scope.repositoryUrl},
                    }
                });
                signupModal.result.then(function(selectedItem) {
                  console.log(selectedItem);
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

        }
    ]);
});
