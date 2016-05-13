'use strict';

angular.module('messageApp')
    .controller('MainCtrl', function ($scope, $rootScope, $location, $sce, Auth, Posts, Likes, Location) {

        $scope.loggedIn = function() {
            //var u = sessionStorage.getItem('loggedIn') || null;
            var u = $rootScope.currentUser || null;
            return ($rootScope.currentUser || null) !== null;
        };
	
	    $scope.id = 1;
	
	    $scope.hashCode = function(string) {
  	        var hash = 0, i, chr, len;
  	        if (string.length === 0) return hash;
  	        for (i = 0, len = string.length; i < len; i++) {
    	        chr   = string.charCodeAt(i);
    	        hash  = ((hash << 5) - hash) + chr;
    	        hash |= 0; // Convert to 32bit integer
  	        }
  	        return hash;
	    };

        $scope.email = $rootScope.currentUser !== null ? $rootScope.currentUser.email : "";

        $scope.chat = false;
        $scope.posts = [];

        $scope.urls = {};

        $scope.Math = window.Math;

        $scope.genUrl = function(lat, lon, num, email) {
            $scope.urls[email+num] = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/view?" +
                "key=AIzaSyBK7cRWPPB2Z727vsbiOgJUV_CEFS4GzUA&center="+lat+","+lon+"&zoom=9");
        };

        $scope.showMap = function(id) {
            $("#map"+id).toggleClass('collapsed').find("iframe").prop("src", function(){
                // Set their src attribute to the value of data-src
                if($('#map'+id).hasClass('collapsed')) {
                    $(this).css('display','none');
                }
                else {
                    $(this).css('display','block');
                    return $(this).data("src")
                }

            });
        };

        $scope.getLatestPosts = function() {
            Posts.get(function(data){
                var posts = data.posts;
                $scope.posts = posts;
            },function(err) {
                console.log(err)
            })
        };

        $scope.getLikedMessages = function() {
            Likes.get(function(data) {
                $scope.posts = data.posts || [];
            },
            function(err) {
                $scope.errors = err;
            });
        };

        $scope.getLocatedMessages = function() {
            Location.get(function(data) {
                $scope.posts = data.posts || [];
            },
            function(err) {
                $scope.errors = err;
            })
        };

        $scope.like = function(poster_email, post_number) {
            var email = $scope.email || "";
            if(email !== "") {
                Likes.like({
                    liker: email,
                    poster: poster_email,
                    number: post_number
                },
                    function(data) {
                        console.log("Message liked");
                    },
                    function(err) {
                        console.log(err);
                        $scope.errors = err;
                    });
            }
        };

        $scope.unlike = function(poster_email, post_number) {
            var email = $scope.email || "";
            if(email !== "") {
                Likes.unlike({
                    liker: email,
                    poster: poster_email,
                    number: post_number
                },
                function(data) {
                    console.log("Message unliked");
                },
                function(err) {
                    console.log(err);
                   $scope.errors = err;
                });
            }
        };

        $scope.logout = function() {
            Auth.logout(function(err) {
                if(!err) {
                    $location.path('login');
                }
            });
        };
    });
