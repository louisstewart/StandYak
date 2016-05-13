'use strict';

angular.module('messageApp')
    .controller('SignUpCtrl', function ($scope, Auth, $location) {
        $scope.register = function(form) {
            var dob = $scope.user.dob;
            dob = new Date(dob);
            dob = (dob.getFullYear() + "-"+(dob.getMonth()+1)+"-"+dob.getDate()); // Adjust for time zone;
            Auth.createUser({
                    email:    $scope.user.email,
                    password: $scope.user.password,
                    first_name: $scope.user.first_name,
                    last_name: $scope.user.last_name,
                    date_of_birth: dob
                },
                function(err) {
                    $scope.errors = {};

                    if (!err) {
                        $location.path('/login');
                    } else {
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mariadb', false);
                            $scope.errors[field] = error.type;
                        });
                    }
                }
            );
        };
    });