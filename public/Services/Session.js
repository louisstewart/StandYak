'use strict';

angular.module('messageApp')
    .factory('Session', function ($resource) {
        return $resource('/auth/session/');
    });
