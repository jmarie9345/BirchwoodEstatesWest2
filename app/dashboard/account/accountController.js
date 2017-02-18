(function() {

    'use strict';

    angular.module('app').controller('AccountController', AccountController);

/* first paramter is name of controller. second parameter is the function of the controller (noted below) */

    function AccountController($scope, $rootScope, GlobalService, $state, $location, $anchorScroll, $timeout, $filter) {


        $scope.globalBalance = 0;

        $scope.payment = payment;

        $scope.currentBalance = 0;

        $scope.userDashboardData = {

            messages: [],
            payments: [],
            currentBalance: [],
            postings: [],
            userInfo: [],
            dues: [],
            accountActivity: [],

        }

        init();

        function init() {

            firebase.auth().onAuthStateChanged(function(user) {

                if(user) {

                    //load global messages
                    loadGlobalMessageFromFirebase();

                    //load payments 
                    loadPaymentsFromFirebase();

                    //load user info
                    loadUserInfoFromFirebase();

                } else {
                    $state.go("landing");
                }

            });


        }

        function payment(amount, whoToPay) {
            //Venmo API setup
            //Call to send payment
        }
 
        function loadGlobalMessageFromFirebase() {

            firebase.database().ref('messages').once('value').then(function(snapshot) {
                
                console.log("messages: " + snapshot.val());
                $scope.userDashboardData.messages = snapshot.val();
                $scope.$apply();

            });

        };

       function loadPaymentsFromFirebase() {

            var user = firebase.auth().currentUser;

            GlobalService.setupUserData(user, "accountActivity").then(function(accountActivity) {
       
                var activities = [];
                for (var key in accountActivity) {
                    activities.push(accountActivity[key]);
                }

                var orderedActivities = $filter('orderBy')(activities, 'date');

                var currentBalance = 0;

                for (var activity=0; activity < orderedActivities.length; activity++) {

                    currentBalance = (currentBalance - orderedActivities[activity].amountDue) + orderedActivities[activity].amountPaid;
                    orderedActivities[activity].currentBalance = currentBalance;
                }

                $scope.globalBalance = currentBalance;

                $scope.userDashboardData.accountActivity = orderedActivities;

                // $scope.$apply();

            
            }).catch(function(error) {

            });

        };



        function loadUserInfoFromFirebase() {

            var user = firebase.auth().currentUser;

             GlobalService.setupUserData(user, "userInfo").then(function(userInfo){
                $scope.userDashboardData.userInfo = userInfo;
                // $scope.$apply();

             });


        }



 };

    


})();