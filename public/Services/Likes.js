/**
 * Created by Louis on 21/04/2016.
 */
'use strict';

angular.module('messageApp')
    .factory('Likes', function ($resource) {
        return $resource('/likes/:liker/:poster/:number', {},
            {
                'like': {
                    method: 'PUT',
                    params:{liker:'@liker',poster:'@poster',number:'@number'}
                },
                'unlike': {
                    method: 'DELETE',
                    params:{liker:'@liker',poster:'@poster',number:'@number'}
                }
            });
    });
