/**
 * Created by Louis on 22/04/2016.
 */
'use strict';

angular.module('messageApp')
    .factory('Location', function ($resource) {
        return $resource('/location/:email/:num', {},
            {
                'delete': {
                    method: 'DELETE',
                    params: {email:'@email',num:'@num'}
                }
            });
    });
