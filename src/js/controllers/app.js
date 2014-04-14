define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('AppCtrl', ['$scope', 'securityService', 'db', '$state', function ($scope, securityService, db, $state) {


        securityService.hasValidToken().then(function(hasToken) {
            $scope.authenticated = hasToken;
        });

        securityService.getUserInfos().then(function(user){
            $scope.user = user;
        });

        $scope.$on('new-file', function(e, menu, item) {
            $state.go('file_new');
        });

        $scope.$on('open-file', function(e, menu, item) {
            $state.go('file_open');
        });

    }]);
});
