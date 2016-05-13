/**
 * Created by ls99
 */
'use strict';

angular.module('messageApp')
    .directive('getMessages', function ($http, Posts) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                function validate(value) {
                    if(!value || value === undefined) {
                        return scope.getLatestPosts();
                    }
                    if(value === "") {
                        scope.getLatestPosts();
                    }
                    else {
                        Posts.get({email:value},function (data) {
                            if(data.posts.length > 0) {
                                scope.posts = data.posts;
                            }

                        });
                    }
                }

                scope.$watch( function() {
                    return ngModel.$viewValue;
                }, validate);
            }
        };
    });

