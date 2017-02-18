(function() {

    'use strict';

    // var runAdmin = false;
    // var app = null;

    angular.module('app')

    .run(function($rootScope, $window){
        $rootScope.firstName="jackie";
        $rootScope.lastName="";
        $rootScope.userIsLoggedIn=false;
        $rootScope.avatarURL = "";
        $rootScope.currentUserID = "";
        $rootScope.commonPath = "clients/";
        $rootScope.connectionState = false;

        // if (runAdmin === false) {
        //      angular.module('app') = angular.module('clientsApp');

        // } else {
        //      angular.module('app') = angular.module('adminApp');

        // }
        var connectedRef = firebase.database().ref(".info/connected");
            connectedRef.on("value", function(snap) {
            if (snap.val() === true) {
                // alert("connected");
                $rootScope.connectionState = true;

                // localStorage.setItem('myCat','Tom'); /* key value pair */

            } else {
                // alert(window.localStorage['myCat']); /*alert tom */
                 $rootScope.connectionState = false;
              }
            });

    })
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/landing");

        $stateProvider
            .state('landing', {
                url: "/landing",
                templateUrl: "app/landing/landing.html",
                controller: 'LandingController'
            })
            .state('dashboard', {
                abstract: true,
                url: "/dashboard",
                templateUrl: "app/dashboard/dashboard.html"
                // controller: 'DashboardController'
            })
                    .state('dashboard.account', {
                        url: "/account",
                        templateUrl: "app/dashboard/account/account.html",
                        controller: 'AccountController'
                    })
                    .state('dashboard.profile', {
                        url: "/profile",
                        templateUrl: "app/dashboard/profile/profile.html",
                        controller: 'ProfileController'
                    })
                    .state('dashboard.community', {
                        url: "/community",
                        templateUrl: "app/dashboard/community/community.html",
                        controller: 'CommunityController'
                    })            


    });

})();