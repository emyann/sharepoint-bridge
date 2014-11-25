define(['./module','_'], function(controllers,_) {
    'use strict';

    controllers.controller('RepositoryCtrl', ['$scope', 'securityService', '$location', 'db', 'Repository', '$log',
        function($scope, securityService, $location, db, Repository, $log) {
                var path = require('path'),
                fs = require('fs'),
                urlparse = require('url').parse;
           
             $scope.getFiles = function() {
                this.files = [];
                var env = process.env;
                var workspace = path.join(env.SystemDrive, env.HOMEPATH, '\\Documents\\Supinfo\\4MOS');
                this.files = fs.readdirSync(workspace);
                console.log(this.files);
            };
         

        }
    ]);
});
