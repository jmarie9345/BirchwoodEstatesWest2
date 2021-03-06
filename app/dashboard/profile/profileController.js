(function() {

    'use strict';

    angular.module('app').controller('ProfileController', ProfileController);

/* first paramter is name of controller. second parameter is the function of the controller (noted below) */

    function ProfileController($scope, $rootScope, GlobalService, $state, Upload, $timeout) {


        $scope.sendUpdatedUserInfo = sendUpdatedUserInfo;
        $scope.uploadFiles = uploadFiles;
        $scope.profile = {
            userInfo: {}
        }

        init();

        function init() {

            //check connection
                //if true and local storage (browser) is empty
                    //retrieve data from firebase
                //if true and local storage is not empty
                    //retrieeve from local storage
                //if false
                    //retrieve from local storage
                //  window.localStorage.setItem("userid", "jackie1");

                // firebase.database().ref("dummy123").set({
                //        name: "Jackie",
                //        color: "Red",
                //        computer: "Apple"
                // });

                // firebase.database().ref("dummy123").update({
                //     url: "Paul"
                // });

                //  $rootScope.firstName = "Paul";
            //  if ($rootScope.connectionState === true) {

                 debugger;
                var user = 	window.localStorage.getItem("userid");
                var userObject = JSON.parse(user)
                setupUserInformation(userObject);


                // firebase.auth().onAuthStateChanged(function(user) {
                //     if (user) {

                //         setupUserInformation(user);

                //      }  else {
                //          $state.go("landing");
                //      }  

                //  });

            //  } else {
                /* display message showing disconnected */
            //  }
        }

        function setupUserInformation(user) {

            // firebase.database().ref("clients/" + user.uid + "/userInfo").once('value').then(function(snapshot) {
            //     console.log("userInfo" + snapshot.val());
            //     debugger;
            //     $scope.profile.userInfo =snapshot.val();
            //     // $scope.messagesTest=["test1", "test2"];
            //     $scope.$apply();
            // });
            GlobalService.setupUserData(user, "userInfo").then(function(userProfileData) {
                
                $scope.profile.userInfo = userProfileData;
                // $scope.$apply();
            
            }).catch(function(error) {

            });
        }


        function sendUpdatedUserInfo(user) {

             firebase.database().ref("clients/" + user.uid + "/userInfo").set({
                resident1Name: $scope.resident1Name,
                email: $scope.email,
            });
        }

        function uploadFiles(file, errFiles) {

            var storageRef = firebase.storage().ref();

            // $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                        var url = "avatars/" + "jackieID" + "/avatar.png";
                        console.log("url for avatar images: " + url)
                        var avatarRef = storageRef.child(url);
                        avatarRef.put(file).then(function(snapshot) {
                            
                            console.log('Picture uploaded to Firebase Storage');

                            // Create a reference with an initial file path and name
                            var storage = firebase.storage();
                            // Create a reference to the file we want to download
                            var avatarRef = storage.ref("avatars/" + "jackieID" + '/avatar.png');

                            // Get the download URL
                            avatarRef.getDownloadURL().then(function(url) {
                            // Insert url into an <img> tag to "download"
                                console.log("downloaded url: " + url)
                                $rootScope.avatarURL = url;
                                $scope.$apply();
                                
                                var user = 	window.localStorage.getItem("userid");
                                var userObject = JSON.parse(user)

                                // firebase.auth().onAuthStateChanged(function(user) {
                                    debugger;
                                    firebase.database().ref("clients/" + userObject.uid + "/userInfo").update({
                                            avatarURL: url
                                    });
                                // });
                                

                            }).catch(function(error) {
                    
                                console.log("error downloading: " + error)
                            });

                            $rootScope.$apply();

                        });
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * 
                                            evt.loaded / evt.total));
                });
            }   
        } 

    };

})();