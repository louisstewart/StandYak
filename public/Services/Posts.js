'use strict';

angular.module('messageApp')
    .factory('Posts', function ($resource) {
        return $resource('/posts/:email/:num', {},
            {
                'delete': {
                    method: 'DELETE',
                    params: {email:'@username',num:'@num'}
                },
                'fetchUser':{
                    method: 'GET',
                    params:{email:'@email'}
                },
                'update':{
                    method:'PUT'
                }
            });
        });
