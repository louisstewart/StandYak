'use strict';

angular.module('messageApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $location, $route, Auth, Posts) {

        $scope.email = JSON.parse(sessionStorage.getItem("currentUser")).email;
        $scope.messages = [];
        $scope.modifiers = [];

        $scope.loggedIn = function() {
            var u = $rootScope.currentUser || null;
            return u !== null;
        };

        $scope.display = false;

            if('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    console.log('longitude:'+position.coords.longitude.toFixed(4)+',latitude:'+position.coords.latitude.toFixed(4));
                    $scope.longitude = position.coords.longitude.toFixed(4);
                    $scope.latitude = position.coords.latitude.toFixed(4);
                    $scope.display = true;
                    $scope.$apply();
                });
            }

        $scope.curUser = function() {
            Auth.currentUser();
        };

        $scope.postText = function(located) {
            var textMessage = $('#text').text() || "";
            var email = $scope.email || "";
            var long = $scope.longitude || null;
            var lat = $scope.latitude ||  null;
            if(textMessage !== "" && email !== "") {
                if(located) {
                    Posts.save({
                            content: textMessage,
                            email: email,
                            longitude: long,
                            latitude: lat
                        },
                        function (data) {
                            $('#text').text("");
                            $scope.searchUser();
                        },
                        function (err) {
                            console.log(err);
                        });
                }
                else {
                    Posts.save({
                            content: textMessage,
                            email: email,
                            longitude: null,
                            latitude: null
                        },
                        function (data) {
                            $('#text').text("");
                            $scope.searchUser();
                        },
                        function (err) {
                            console.log(err);
                        });
                }
            }
        };

        $scope.postPicture = function(located) {
            var email = $scope.email || "";
            var url = $('#url').val() || "";
            var type = $('#type').val() || "";
            var description = $('#description').text() || "";
            var long = $scope.longitude || null;
            var lat = $scope.latitude || null;
            if(email !== ""&& url !== "" && type !== "" && description !== "") {
                if(located) {
                    Posts.save({
                            email: email,
                            content: url,
                            type: type,
                            description: description,
                            longitude: long,
                            latitude: lat
                        },
                        function (data) {
                            $('#url').val("");
                            $('#type').val("");
                            $('#description').text("");
                            $scope.searchUser();
                        },
                        function (err) {
                            $scope.errors = err;
                        });
                }
                else {
                    Posts.save({
                            email: email,
                            content: url,
                            type: type,
                            description: description,
                            longitude: null,
                            latitude: null
                        },
                        function (data) {
                            $('#url').val("");
                            $('#type').val("");
                            $('#description').text("");
                            $scope.searchUser();
                        },
                        function (err) {
                            $scope.errors = err;
                        });
                }
            }
        };

        $scope.deleteMessage = function(num) {
            var number = num || 0;
            var email = $scope.email || "";
            if( number > 0 && email !== "") {
                Posts.delete({
                    email: email,
                    num:number
                },
                function(data) {
                    $scope.searchUser();
                },
                function(err) {
                    $scope.errors = err;
                })
            }
        };

        $scope.modify = function(num) {
            $scope.modifiers[num] = 1;
        };

        $scope.save = function(num) {
            var email = $scope.email || "";
            var number = num || 0;
            var content  = $('#msg'+num).val() || "";
            if(email !== "" && number > 0 && content !== "") {
                Posts.update({
                    email: email,
                    num: number,
                    content: content
                },
                function(data) {
                    $scope.modifiers[num] = 0;
                    $scope.searchUser();
                },
                function(err) {
                    $scope.errors = err;
                });
            }
        };

        $scope.searchUser = function() {
            var email = $scope.email || "";
            if(email === "") return $scope.posts = [];
            Posts.fetchUser({
                    'email': email
                },
                function(data) {
                    var posts = data.posts.slice();
                    $scope.messages = posts || [];
                },
                function(err) {
                    $scope.errors = err;
                });
        };

        var invalidKeys = [37,38,39,40,46,8,36,35];

        $("[contenteditable='true']").each(function(index,el) {
            var el = $(el);
            var len = el.data('text-length') || 0;
            if(!isNaN(len)) {
                el.on('keydown',function(e){
                    if(invalidKeys.indexOf(e.which) === -1 && el.text().length > len) {
                        e.preventDefault();
                        return false;
                    }
                });
            }
        });

    });
