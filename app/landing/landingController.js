(function() {

    'use strict';

/* .controller creates the controller for the app */
    angular.module('app').controller('LandingController', LandingController);

/* dependencies (services) are injected into the controller - ie $scope*/
    function LandingController($scope, $rootScope, GlobalService, $state, $location, $anchorScroll, $window) {
    	
    	console.log("$rootScope firstName" + $rootScope.firstName);

   		/*********************************
		SCOPE VARIABLES
		*********************************/

		/* declare all varibales to prevent breaking. instead it will just show a blank */
    	$scope.txtPassword = "";
    	$scope.txtEmail = "";
    	$scope.name = GlobalService;
    	$scope.signIn = signIn;
    	$scope.contactUsForm = {
    		contactName: "",
    		contactEmail: "",
    		contactMessageBody: "",
    		contactPhone: ""
    	}
    	//Google setup
        $scope.map = {};
		$scope.marker = {
		}

   		/*********************************
		FUNCTION
		*********************************/
   		$scope.sendEmail = sendEmail;
   		$scope.goToTop = goToTop;
   		$scope.resizeModal - resizeModal;

   		init()

   		function init() {

   			setupGoogleMaps();

	    	//Initialize Google Maps
	        $scope.map = { 
	        	center: { 
	        		latitude: 43.033980, 
	        		longitude: -82.464194 
	        	}, 
	        	zoom: 14 
	        };

			$scope.marker = {
			      id: 0,
			      coords: {
			        latitude: 43.033980,
			        longitude: -82.464194 
			      },
			      options: { draggable: true },
			      events: {
			        dragend: function (marker, eventName, args) {
			          $log.log('marker dragend');
			          var lat = marker.getPosition().lat();
			          var lon = marker.getPosition().lng();
			          $log.log(lat);
			          $log.log(lon);

			          $scope.marker.options = {
			            draggable: true,
			            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
			            labelAnchor: "100 0",
			            labelClass: "marker-labels"
			          }
			        }
			      }
			}

	   	}	

	   	function setupGoogleMaps() {
		  	var mapDiv = document.getElementById('googleMap');
		  	var map = new google.maps.Map(mapDiv, {
			    center: {lat: 43.033980, lng: -82.464194},
			    zoom: 14
			    })
		  	var marker = new google.maps.Marker({
                 position: new google.maps.LatLng(43.033980, -82.464194),
                 map: map,
	      	});
	   	}
	   	
 		function signIn(){
			
			firebase.auth().signInWithEmailAndPassword("jmarie9345@gmail.com", "Welcome01")
			.then(function(){
				console.log("successful signup!");
				$rootScope.userIsLoggedIn=true;

				firebase.auth().onAuthStateChanged(function(user) {
							
							if (user) {
					
									window.localStorage.setItem("userid", JSON.stringify(user));

									var user = 	window.localStorage.getItem("userid");
                  					var userObject = JSON.parse(user)
									GlobalService.setupUserData(userObject, "userInfo").then(function(userProfileData) {
											debugger;
											$rootScope.avatarURL = userProfileData.avatarURL;
									
									}).catch(function(error) {

									});

							}  else {
							
							}  

					});

				$state.go("dashboard.account");

			})
			.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("error code" + errorCode);
			console.log("error message" + errorMessage);

			  // ...
			});
		}


      function sendEmail() {

      	var emailContent = {  
      		"contactName": $scope.contactUsForm.contactName,
      		"message_html": $scope.contactUsForm.contactMessageBody,
      		"contactPhone": $scope.contactUsForm.contactPhone,
      		"contactEmail": $scope.contactUsForm.contactEmail
      	}
        
        emailjs.send("gmail", "birchwood_estates_inquiry", emailContent).then(
		  function(response) {
		    
		    console.log("SUCCESS", response);
			
			$scope.contactUsForm = {
	    		contactName: "",
	    		contactEmail: "",
	    		contactMessageBody: "",
	    		contactPhone: ""
    		}

    		$scope.$apply();


		  }, 
		  function(error) {
		    console.log("FAILED", error);
		  }
		);
	

      };

      function goToTop() {
		$location.hash('header');
		$anchorScroll();
      }    

      function resizeModal() {

      	$('.property1Modal').on('shown',function(){
     	var offset = 0;
     	$(this).find('.modal-body').attr('style','max-height:'+($(window).height()-offset)+'px !important;');
  		});
  	  }




	}



})();		




