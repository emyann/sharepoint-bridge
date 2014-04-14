define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('WorkspaceCtrl', ['$scope', 'securityService', '$location', function ($scope, securityService, $location) {
        var path=require('path'),
        fs=require('fs');
       
        $scope.getFiles = function() {
            this.files=[];
            var env= process.env;
           var workspace=path.join(env.SystemDrive,env.HOMEPATH,'\\Documents\\Supinfo');
          this.files = fs.readdirSync(workspace);
          console.log(this.files);
        };

         $scope.getFiles();

    }]);
});