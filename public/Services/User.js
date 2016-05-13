'use strict';

angular.module('messageApp')
    .factory('User', function ($resource) {
        return $resource('/auth/users/:id/', {},
            {
                'update': {
                    method:'PUT'
                }
            });
    });
