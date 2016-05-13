/**
 * Created by ls99
 */
'use strict';

angular.module('messageApp')
    .directive('notOwnUsername', function ($rootScope) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                function validate(value) {
                    var username = JSON.parse(sessionStorage.getItem("currentUser")).username;
                    if(!value) {
                        ngModel.$setValidity('self', true);
                        return;
                    }

                    if(value !== username) {
                        ngModel.$setValidity('self', true);
                    } else {
                        ngModel.$setValidity('self', false);
                    }

                }

                scope.$watch( function() {
                    return ngModel.$viewValue;
                }, validate);
            }
        };
    });

