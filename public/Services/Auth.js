'use strict';

angular.module('messageApp')
    .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
        $rootScope.currentUser = $cookieStore.get('user') || null;
        $cookieStore.remove('user');

        return {

            login: function(provider, user, callback) {
                var cb = callback || angular.noop;
                Session.save({
                    email: user.email,
                    password: user.password
                }, function(user) {
                    $rootScope.currentUser = user;
                    sessionStorage.setItem('currentUser',JSON.stringify(user));
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            },

            logout: function(callback) {
                var cb = callback || angular.noop;
                Session.delete(function(res) {
                        $rootScope.currentUser = null;
                        sessionStorage.removeItem('currentUser');

                        return cb();
                    },
                    function(err) {
                        return cb(err.data);
                    });
            },

            createUser: function(userinfo, callback) {
                var cb = callback || angular.noop;
                User.save(userinfo,
                    function(user) {
                        return cb();
                    },
                    function(err) {
                        return cb(err.data);
                    });
            },

            currentUser: function() {
                Session.get(function(user) {
                    $rootScope.currentUser = user;
                });
            },

            changePassword: function(email, oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;
                User.update({
                    email: email,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    console.log('password changed');
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            },

            removeUser: function(email, password, callback) {
                var cb = callback || angular.noop;
                User.delete({
                    email: email,
                    password: password
                }, function(user) {
                    console.log(user + 'removed');
                    return cb();
                }, function(err) {
                    return cb(err.data);
                });
            }
        };
    })