'use strict';

angular.module('messageApp')
    .controller('LoginCtrl', function ($scope, Auth, $location) {
        $scope.error = {};
        $scope.user = {};

        $scope.login = function(form) {
            Auth.login('password', {
                    'email': $scope.user.email,
                    'password': $scope.user.password
                },
                function(err) {
                    $scope.errors = {};

                    if (!err) {
                        $location.path('/');
                    } else {
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('rethinkdb', false);
                            $scope.errors[field] = error.type;
                        });
                        $scope.error.other = err.message;
                    }
                });
        };
    });