'Use Strict';
angular.module('app.controllers', [])


.controller('forgotController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  $scope.resetpassword = function(user) {
      if(angular.isDefined(user)){
      Auth.resetpassword(user)
        .then(function() {
          //console.log("Password reset email sent successfully!");
          $location.path('/login');
        }, function(err) {
           //console.error("Error: ", err);
        });
      }
    };
})

.controller('homeController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);

  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  }

})

.controller('loginController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  var userkey = "";
  $scope.signIn = function (user) {
    console.log("login success");
    if(angular.isDefined(user)){
    Utils.show();
    Auth.login(user)
      .then(function(authData) {
      //console.log("id del usuario:" + JSON.stringify(authData));

      ref.child('profile').orderByChild("id").equalTo(authData.uid).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        userkey = snapshot.key();
        var obj = $firebaseObject(ref.child('profile').child(userkey));

        obj.$loaded()
          .then(function(data) {
            //console.log(data === obj); // true
            //console.log(obj.email);
			$localStorage.username = obj.name;
            $localStorage.useremail = obj.email;
			$localStorage.vehiclename=obj.vehicle_name;
			$localStorage.licenceplate=obj.licence_plate;
			$localStorage.mobileno=obj.mobile;
			$localStorage.uregdate=obj.registered_in;
            $localStorage.userkey = userkey;

              Utils.hide();
              $state.go('home');
              console.log("Starter page","Home");

          })
          .catch(function(error) {
            console.error("Error:", error);
          });
      });

      }, function(err) {
        Utils.hide();
         Utils.errMessage(err);
      });
    }
  };

})

.controller('registerController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {

  $scope.register = function(user) {
    if(angular.isDefined(user)){
    Utils.show();
    Auth.register(user)
      .then(function() {
         Utils.hide();
         console.log("user login id:" + JSON.stringify(user));
         Utils.alertshow("Successfully","The User was Successfully Created.");
         $location.path('/');
      }, function(err) {
         Utils.hide();
         Utils.errMessage(err);
      });
    }
  };

})

.controller('welcomeEVUserCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

.controller('homeController', function($scope,$localStorage) {
	$scope.username=$localStorage.username;
})


//isuru start

.controller('StationCtrl', function($scope,$firebase,$ionicPopup) {
	
// Adding new station
	$scope.station = {};

	$scope.showAlert = function() {
	    $ionicPopup.alert({
	        title: 'Add Stations',
	        template: 'Your location has been saved!!'
	    });
	};



	$scope.saveDetails = function(){
	
		 
	    var lat = $scope.station.latitude;
	    var lgt = $scope.station.longitude;
	    var nme = $scope.station.name;
		var dsc = $scope.station.desc;
		var typ = $scope.station.type;
		var add = $scope.station.address;
		var cnt = $scope.station.contact;
		var ema = $scope.station.email;
		var web = $scope.station.web;
		
		 

	    var fb = new Firebase("https://snev.firebaseio.com/Stations_Details");

	    fb.push({
		    latitude: lat,
		    longitude: lgt,
		    name: nme,
			description:dsc,
			type:typ,
			address:add,
			contact:cnt,
			email:ema,
			state:"active",
			website:web,

		}).then(function(ref) {
		    $scope.static = {};
		    $scope.showAlert();
		}, function(error) {
		    console.log("Error:", error);
		});


  	}
})


.directive('addmap', function() {
    return {
        restrict: 'A',
        link:function(scope, element, attrs){

          var zValue = scope.$eval(attrs.zoom);
          var lat = scope.$eval(attrs.lat);
          var lng = scope.$eval(attrs.lng);


          var myLatlng = new google.maps.LatLng(lat,lng),
          mapOptions = {
              zoom: zValue,
              center: myLatlng,
			   mapTypeId: google.maps.MapTypeId.ROADMAP
          },
          map = new google.maps.Map(element[0],mapOptions),
          marker = new google.maps.Marker({
			    position: myLatlng,
			    map: map,
				icon: 'img/station.png',
			    draggable:true
		  });

		  google.maps.event.addListener(marker, 'dragend', function(evt){
		    scope.$parent.station.latitude = evt.latLng.lat();
		    scope.$parent.station.longitude = evt.latLng.lng();
		    scope.$apply();
		  });


        }
    };
})

.controller('stationDetailCtrl', function($scope,stationData,$cordovaGeolocation,$ionicPopup,$cordovaLaunchNavigator) {

	var data = stationData.getProperty();
		if(data=='')
		{console.log("Could not get station details");}

            $scope.name=data.name;
			$scope.description=data.description;
			$scope.address=data.address;
			$scope.contact=data.contact;
			$scope.email=data.email;
			$scope.website=data.website;


		/*$scope.launchNavigator = function() {
			     $cordovaGeolocation.getCurrentPosition().then(function(position){
			
			
		
		var cpostion = {lat: position.coords.latitude, lng: position.coords.longitude};
		
		 
	
		

		var destination = [data.latitude,data.longitude];
		var start = cpostion;
		$cordovaLaunchNavigator.navigate(destination, start).then(function() {
		  console.log("Navigator launched");
		}, function (err) {
		  console.error(err);
		});
		});
	  };*/


	  $scope.call = function () {
		  if(data.contact=='')
			  {$ionicPopup.alert({ template: 'contact not provided!!'});}
			  else
        window.open('tel:' + data.contact, '_system');
      };

      $scope.mail = function () {
		  if(data.email=='')
			  {$ionicPopup.alert({ template: 'Email not provided!!'});}
			  else
				window.open('mailto:' + data.email, '_system');
      };

      $scope.website = function () {
		  if(data.website=='')
			  {$ionicPopup.alert({ template: 'Weblink not provided!!'});}
		  else
			window.open(data.website, '_system');
      };




})
.service('stationData', function () {
        var property = '';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    })




.controller('mapCtrl', function($scope,$cordovaGeolocation,$firebase,stationData,$location) {
        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){

            var nlatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: nlatLng,
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: nlatLng,
					icon: 'img/me.png'

                });
				

                var infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });

                var firebaseObj = new Firebase("https://snev.firebaseio.com/Stations_Details");
				
			///loading only active stations
			
				firebaseObj.orderByChild("state").equalTo("active").on("child_added", function(snapshot) {
				 
				

                        var station = snapshot.val();
						
								 var stationinfoWindow = new google.maps.InfoWindow({
                    content: station.name+'<br> Tel: '+station.contact
                });
						//selecting fast station and assigning seperate icon
						if(station.type=='Fast Charging Station')
						{
							var markerPos = new google.maps.LatLng(station.latitude, station.longitude);


							var stations = new google.maps.Marker({
								map:$scope.map,
								animation: google.maps.Animation.DROP,
								position: markerPos,
								icon: 'img/station.png'
							});
							
						//click event for fast stations
							 google.maps.event.addListener(stations, 'click', function () {
								 stationinfoWindow.open($scope.map, stations);  
							});
						
						
						//doubleclick event for fast stations
							 google.maps.event.addListener(stations, 'dblclick', function () {
								 //var id = snapshot.key();
								 var data = snapshot.val();
								 stationData.setProperty(data);
								 $location.path("/stationDetail");
								 window.location.assign("#/stationDetail");
							});
						}
						//selecting slow station and assigning seperate icon
						else if(station.type=='Slow Charging Station')
						{
							var smarkerPos = new google.maps.LatLng(station.latitude, station.longitude);


							var slowstations = new google.maps.Marker({
								map:$scope.map,
								animation: google.maps.Animation.DROP,
								position: smarkerPos,
								icon: 'img/slowstation.png'
							});
						
						//click event for slow stations
							 google.maps.event.addListener(slowstations, 'click', function () {
								 stationinfoWindow.open($scope.map, slowstations);  
							});
						
						//doubleclick event for slow stations
							 google.maps.event.addListener(slowstations, 'dblclick', function () {
								 //var id = snapshot.key();
								 var data = snapshot.val();
								 stationData.setProperty(data);
								 $location.path("/stationDetail");
								 window.location.assign("#/stationDetail");
							});
						}
						
						

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

				
				firebaseObj.orderByChild("state").equalTo("deactive").on("child_added", function(snapshot) {
				 
				
							
                        var station = snapshot.val();
						
						  var inactiveinfoWindow = new google.maps.InfoWindow({
							content: station.name+"<br>Currently not in service !"
							});
						
							var demarkerPos = new google.maps.LatLng(station.latitude, station.longitude);


							var stations = new google.maps.Marker({
								map:$scope.map,
								animation: google.maps.Animation.DROP,
								position: demarkerPos,
								icon: 'img/destation.png'
							});
							
							 google.maps.event.addListener(stations, 'click', function () {
								inactiveinfoWindow.open($scope.map, stations);  
							});
						
		

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

			//To get closest stations to Ev user
					var me=true;
					var zoom=$scope.map.getZoom();
						 $scope.me = function () {	 
						 if(me)
						 {
							$scope.map.setCenter(nlatLng);
							$scope.map.setZoom(zoom + 5);
							me=false;
						 }
						 
						 else
						 {
							$scope.map.setCenter(nlatLng);
							$scope.map.setZoom(zoom);
							me=true;
						 }
						};
						
            });

					
						
						

        }, function(error){
            console.log("Could not get location");
        });
		
	

})

.controller('stationDirectionCtrl', function($scope,$cordovaGeolocation,$firebase,stationData,$location) {
       var directionsService = new google.maps.DirectionsService();
         var directionsDisplay = new google.maps.DirectionsRenderer();
    
         var map = new google.maps.Map(document.getElementById('addmap'), {
           zoom:7,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         });
        
         directionsDisplay.setMap(map);
         directionsDisplay.setPanel(document.getElementById('panel'));
		 
		
            $cordovaGeolocation.getCurrentPosition().then(function(position){
			
			var data=stationData.getProperty();
		
		var cpostion = {lat: position.coords.latitude, lng: position.coords.longitude};
		var spostion = {lat: data.latitude, lng: data.longitude};
		 
	
		
    
         var request = {
           origin: cpostion, 
           destination: spostion,
           travelMode: google.maps.DirectionsTravelMode.DRIVING
         };
		
         directionsService.route(request, function(response, status) {
           if (status == google.maps.DirectionsStatus.OK) {
             directionsDisplay.setDirections(response);
           }
         });
});
})
//isuru end

.controller('socialNetworkCtrl', function($scope) {

})

.controller('messengerCtrl', function($scope) {

})

.controller('itemsForSaleCtrl', function($scope) {

})

.controller('adminHomepageCtrl', function($scope) {

})

.controller('acceptNewStationCtrl', function($scope) {

})

.controller('acceptRevenueCtrl', function($scope) {

})

.controller('manageProfileCtrl', function($scope) {

})

.controller('newsPageCtrl', function($scope) {

})

.controller('pageCtrl', function($scope) {

})

.controller('groupChatCtrl', function($scope) {

})

.controller('stationChatCtrl', function($scope) {

})

.controller('chatCtrl', function($scope) {

})

.controller('chargingRecordsCtrl', function($scope) {

})
.controller('posthistroy', function($scope) {

})

 //asanaka  start


.controller('RoomsListCtrl', function($scope, $ionicPopup, RoomFactory) {
  $scope.rooms = RoomFactory.allRooms;

//creating a chat room
  $scope.createRoom = function() {
    var timestamp = new Date().valueOf();
    $ionicPopup.prompt({
      title: 'Add a room',
      subTitle: 'Use simple names',
    }).then(function(room) {
      $scope.rooms.$add({
        name: room,
        id: timestamp
      });
    });
  };

//remove a chat room
  $scope.deleteRoom = function(room) {
    $scope.rooms.$remove(room);
  };


})

//send message
.controller('RoomDetailCtrl', function($scope, $stateParams, $ionicHistory, RoomFactory) {
  $scope.room = RoomFactory.room($stateParams.roomId);
  $scope.messages = RoomFactory.messages($scope.room.$id);

  $scope.sendMessage = function(newMessage) {
    RoomFactory.send($scope.newMessage, $scope.room.$id);
    $scope.newMessage = '';
  };

  $scope.backToRoomsList = function() {
    $ionicHistory.goBack();
  };
})


.controller('tempuser', function($scope) {

  $scope.makeTempUser = function(user1) {
    window.localStorage.clear();
  window.localStorage.setItem("user",user1);


  };
})


//post controller
.controller('postCtrl', function($scope ,$ionicPopup){
	var ref = new Firebase('https://snev.firebaseio.com/posts');
	 var ref2 = new Firebase('https://snev.firebaseio.com/comments');


	 		$scope.addlike = function(title) {

	 			var title1=title;

					//get key of child equals to ==title
					  var ref = new Firebase("https://snev.firebaseio.com/posts");
					  ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
					  var value=snapshot.key();
						var data = snapshot.val();
						var noofl=data.noOfLikes;


                var alertPopup = $ionicPopup.alert({
                  title: 'Successful! <i class="ion-checkmark-round"></i>',
                  template:'You have Successfuly liked the post'
                  });

							var postsref = new Firebase('https://snev.firebaseio.com/posts');


												// Modify the 'noOfLikes  but leave other data unchanged
										postsref.child(value).update({ noOfLikes: noofl+1});

						});

          };


		 $scope.adddislike = function(title1) {


	         var username=window.localStorage.getItem("user");
		 					//get key of child equals to ==title
		 					  var ref = new Firebase("https://snev.firebaseio.com/posts");
		 				   	ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
		 					  var value=snapshot.key();
		 						var data = snapshot.val();
		 						var noofl=data.noOfDisLikes;


                               var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>',
                                 template:'You have Successfuly dislied the post'
                              	 });

		 										var postsref = new Firebase('https://snev.firebaseio.com/posts');

		 											postsref.child(value).update({ noOfDisLikes: noofl+1});
		 						});
		 };


     // report a post
  	 $scope.report = function(title1) {

  //  alert("username"+$rootScope.test);
  		// 	var username= $rootScope.test;
          var username=window.localStorage.getItem("user");

  		 				 //get key of child equals to ==title
  		 					 var ref = new Firebase("https://snev.firebaseio.com/posts");
  		 				   ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
  		 					 var value=snapshot.key();
  		 					 var data = snapshot.val();
  		 					 var noof2=data.noOfReports;


                   var alertPopup = $ionicPopup.alert({
                   title: 'Successful! <i class="ion-checkmark-round"></i>',
                   template:'You have Successfuly Reported'
                	 });
  		 									 var postsref = new Firebase('https://snev.firebaseio.com/posts');
  		 									 postsref.child(value).update({ noOfReports: noof2+1});
	        });

	    };


		ref.on("value", function(snapshot,prevChildKey) {
		  $scope.$apply(function(){
			$scope.posts = snapshot.val();
			//console.log(prevChildKey.key());

		  });
		});

		ref2.on("value", function(snapshot) {
		  $scope.$apply(function(){
			$scope.comments = snapshot.val();

		  });
		});
})


//post controller
.controller('mypostCtrl', function($scope ,$ionicPopup){

	var ref = new Firebase('https://snev.firebaseio.com/posts');
  var username=window.localStorage.getItem("user");

		 ref.orderByChild("username").equalTo(username).on("value", function(snapshot,prevChildKey) {
		  $scope.$apply(function(){
			$scope.myposts = snapshot.val();
	//		console.log(prevChildKey.key());

		  });
		});

})


//adding a post
.controller('userController', function($scope, $http, $state,$ionicPopup,$rootScope) {
   $scope.postForm = function(title,description){
      $rootScope.test = "TEST user";
      	 var username= $rootScope.test;
         var imagelocation='https://startupjuncture.com/wp-content/uploads/2016/02/test-in-de-auto-selfie-social-charging.jpeg';

		    var messageListRef = new Firebase('https://snev.firebaseio.com/posts');
     var newMessageRef = messageListRef.push();
       newMessageRef.set({ 'title': title, 'description': description ,'image':'https://startupjuncture.com/wp-content/uploads/2016/02/test-in-de-auto-selfie-social-charging.jpeg', 'username':username, 'noOfLikes': 0,'noOfDisLikes': 0 ,'noOfReports': 0  });
       var path = newMessageRef.toString();

         $scope.title="";
         $scope.description="";


      };
})




.controller('cmntController', function($scope ,$ionicPopup,$location) {

	$scope.addComment = function(comment,title1) {

	//get key of child equals to ==title
	  var ref = new Firebase("https://snev.firebaseio.com/posts");
  	ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
	  var value=snapshot.key();

    var username=window.localStorage.getItem("user");

		//adding  comments
		var messageListRef = new Firebase('https://snev.firebaseio.com/comments');
		var newMessageRef = messageListRef.push();
	 newMessageRef.set({ 'title': title1, 'comment':comment  , 'username': username, 'noOfLikes': 0,'noOfDisLikes': 0  });
	 var path = newMessageRef.toString();


    var alertPopup = $ionicPopup.alert({
      title: 'Successful! <i class="ion-checkmark-round"></i>',
      template:'You have Successfuly Commented'
      });
		 		$scope.comment="";

		});
  };
})

// viewing post
.controller('viewpostController', function($scope ,$ionicPopup,$location) {

//adding a comment
	$scope.addComment = function(comment,title1) {

	//get key of child equals to ==title
	  var ref = new Firebase("https://snev.firebaseio.com/posts");
	ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
	  var value=snapshot.key();




		//add comments
		var messageListRef = new Firebase('https://snev.firebaseio.com/comments');
		var newMessageRef = messageListRef.push();
	 newMessageRef.set({ 'title': title1, 'comment':comment  , 'username': 'usernamevar', 'noOfLikes': 0,'noOfDisLikes': 0  });
	 var path = newMessageRef.toString();

	 var alertPopup = $ionicPopup.alert({
			template: '<i class="ion-checkmark-round"></i> Successfully commented  '
	 	});
		 		$scope.comment="";

		});
  };
})


//get selected post and store
.controller('newselect', function($scope ,$ionicPopup,$location,$window) {

	$scope.setSelectedPost = function(title1) {
    window.localStorage.clear();
  window.localStorage.setItem("settitle",title1);
  	};
  })



  // get selected post deatils ; load comments and posts
  .controller('getSelectedpost', function($scope ,$ionicPopup,$window){

	var SelectdP=window.localStorage.getItem("settitle");
  // alert(SelectdP);

  	var ref = new Firebase('https://snev.firebaseio.com/posts');
    var ref2 = new Firebase('https://snev.firebaseio.com/comments');


         ref2.orderByChild("title").equalTo(SelectdP).on("value", function(snapshot,prevChildKey) {
           $scope.mycomments = snapshot.val();
           	console.log(snapshot.val());
            });


  		  ref.orderByChild("title").equalTo(SelectdP).on("value", function(snapshot,prevChildKey) {
  		  $scope.$apply(function(){
  			$scope.myposts = snapshot.val();
  		//	console.log(prevChildKey.key());

  		        });
	       });

  })


//  update post controller
.controller('postUpdateCtrl', function($scope ,$ionicPopup,$location,$window) {
	var SelectdP=window.localStorage.getItem("settitle");
	$scope.updatePost = function(title1,description) {

    var ref = new Firebase('https://snev.firebaseio.com/posts');


      ref.orderByChild("title").equalTo(SelectdP).on("child_added", function(snapshot) {
        var value=snapshot.key();

        	ref.child(value).update({ title: title1});


        });

        var alertPopup = $ionicPopup.alert({
        title: 'Successful! <i class="ion-checkmark-round"></i>',
        template:'You have Successfuly Updated'
         });

  	};
  })

/************/
//Make Appointment
 .controller ('makeAppointmentCtrl' , function($scope, $http, $state,$ionicPopup) {
	$scope.makeAppointmentForm = function(cname, tele, vRegNum, station) {
		var makeAppoRef1 = new Firebase('https://snev.firebaseio.com/make_apointments');
		var makeAppoRef1 = makeAppoRef1.push();
		
		//pass the data to DB ---------------------------------------------------------------
     var noticeID = makeAppoRef1.key();
       makeAppoRef1.set({ 'cname': cname,   'tele': tele , 'vRegNum': vRegNum});
       var path = makeAppoRef1.toString();

		//alert successfully add
		var alertPopup = $ionicPopup.alert({
		title: 'Successful! <i class="ion-checkmark-round"></i>',
		template:'You have Successfuly added the notice' 
		});

         $scope.cname="";
			
         $scope.tele="";
		 $scope.vRegNum="";
		 $scope.date="";
			

	}
		//Clear the fields.------------------------------------------------
		$scope.makeAppointmentForm2 = function(cname, tele, vRegNum) {
  		$scope.cname="";
			
         $scope.tele="";
		 $scope.vRegNum="";
		 $scope.date="";
		};
 })


 //asanka end
/************/
//Make Appointment
 .controller ('makeAppointmentCtrl' , function($scope, $http, $state,$ionicPopup) {
	$scope.makeAppointmentForm = function(cname, tele, vRegNum, station) {
		var makeAppoRef1 = new Firebase('https://snev.firebaseio.com/make_apointments');
		var makeAppoRef1 = makeAppoRef1.push();
		
		//pass the data to DB ---------------------------------------------------------------
     var noticeID = makeAppoRef1.key();
       makeAppoRef1.set({ 'cname': cname,   'tele': tele , 'vRegNum': vRegNum});
       var path = makeAppoRef1.toString();

		//alert successfully add
		var alertPopup = $ionicPopup.alert({
		title: 'Successful! <i class="ion-checkmark-round"></i>',
		template:'You have Successfuly added the notice' 
		});

         $scope.cname="";
			
         $scope.tele="";
		 $scope.vRegNum="";
		 $scope.date="";
			

	}
		//Clear the fields.------------------------------------------------
		$scope.makeAppointmentForm2 = function(cname, tele, vRegNum) {
  		$scope.cname="";
			
         $scope.tele="";
		 $scope.vRegNum="";
		 $scope.date="";
		};
 })


//view user records
.controller('adminUserRecordsCtrl', function($scope) {

   var ref = new Firebase('https://snev.firebaseio.com/users');
     //var ref2 = new Firebase('https://snev.firebaseio.com/comments');


        ref.on("value", function(snapshot) {
          $scope.$apply(function(){
            $scope.posts = snapshot.val();

          });
        });



})

//view station records
.controller('adminStationRecordsCtrl', function($scope) {

    var ref = new Firebase('https://snev.firebaseio.com/Stations_Details');
     //var ref2 = new Firebase('https://snev.firebaseio.com/comments');


        ref.on("value", function(snapshot) {
          $scope.$apply(function(){
            $scope.posts = snapshot.val();

          });
        });
})

//user view notices------------------------------------------------------------------
.controller('viewNewsPageCtrl', function($scope) {
	 var viewNewsRef1 = new Firebase('https://snev.firebaseio.com/notice');

	 	viewNewsRef1.on("value", function(snapshot) {
           $scope.$apply(function(){
             $scope.posts = snapshot.val();

           });


              var alertPopup = $ionicPopup.alert({
              title: 'Successful! <i class="ion-checkmark-round"></i>',
              template:'You have Successfuly Updated'
             	 });
         });
})


// admin create notice----------------------------------------------------------------------
.controller('noticeController', function($scope, $http, $state,$ionicPopup) {
  $scope.noticePostForm = function(topic,date,notice) {

    var noticeRef1 = new Firebase('https://snev.firebaseio.com/notice');
     var noticeRef1 = noticeRef1.push();


//pass the data to DB ---------------------------------------------------------------
     var noticeID = noticeRef1.key();
       noticeRef1.set({ 'topic': topic,   'date':date ,'notice': notice  });
       var path = noticeRef1.toString();


   var alertPopup = $ionicPopup.alert({
     title: 'Successful! <i class="ion-checkmark-round"></i>',
     template:'You have Successfuly added the notice'
  	 });


         $scope.topic="";
         $scope.date="";
         $scope.notice="";

//----------------------------------------------------------------------------------

  };

//End create notice-------------------------------------------------------------------------

//Cleare the fields.------------------------------------------------
  $scope.noticePostForm2 = function(topic,date,notice) {
  		$scope.topic="";
         $scope.date="";
         $scope.notice="";
  };
});
