'Use Strict';
angular.module('app.controllers', [])
//shopping list part start here...................................................................................................................................

.controller('vehiclepartsController', function($ionicModal, $rootScope,$scope) {
	
	
	
	$scope.parts = [];

	angular.forEach($rootScope.vechileParts, function(key, part) {
		$scope.parts.push(part);
	});
	
						
})

.controller('vehiclepartsControllerNew', function($rootScope,$scope,$state,VechileFactory,$ionicModal, Auth, $stateParams) {
	$scope.selectedParts = VechileFactory.getParts();
	$scope.partDetail = {};


	$scope.init = function() {
		$scope.parts = [];
		angular.forEach($rootScope.vechileParts[$stateParams.part], function(part) {
			$scope.parts.push(part);
		});
	}

	$scope.init();
	$scope.$on('refresh', function() {
		$scope.init();
	});

	$scope.addTOCart = function(part) {	
	    var index = $scope.selectedParts.indexOf(part);
	    if (index > -1) {
	        VechileFactory.removeParts(index);
	        part.isCart = false;
	    } else {
	        VechileFactory.addParts(part);
	        part.isCart = true;
	    }
	}

	$ionicModal.fromTemplateUrl('templates/vehiclePartsCarts.html', {
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.partsCart = modal;
    });

    $ionicModal.fromTemplateUrl('templates/vehiclePartsAdd.html', {
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.partsAdd = modal;
    });

	$scope.addNewPart = function(partDetail) {
	  var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    var sFileName = $("#partImage").val();
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          var filesSelected = document.getElementById("partImage").files;
          if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
            var fileReader = new FileReader();

            fileReader.onload = function(fileLoadedEvent) {
              var textAreaFileContents = document.getElementById(
                "textAreaFileContents"
              );
      				var newPart = {
      					name: partDetail.partName,
      					description: partDetail.partDescription,
      					price: partDetail.partPrice,
      					image: fileLoadedEvent.target.result
      				};
              VechileFactory.addVechileParts(newPart, $stateParams.part);
              $rootScope.vechileParts[$stateParams.part][new Date().valueOf()] = newPart;
     			    $rootScope.$broadcast('refresh');
        			$scope.partDetail = {};
        			$('#partImage').val('');
        			$scope.partsAdd.hide();
            };

            fileReader.readAsDataURL(fileToLoad);
          }
          break;
        }
      }

      if (!blnValid) {
        alert('File is not valid');
        return false;
      }
    }
	}
})


.controller('AppCtrl', function($scope,$location,Auth,$localStorage,$state,$ionicHistory,$window) {
	
		$scope.hideMe=true;
		var checkonce=true;

	$scope.$on('$ionicView.beforeEnter', function() {
		
			if ($state.current.name=="app.home" || $state.current.name=="app.adminHomepage") {
					var interval = setInterval(function(){

					   
						var admin=$localStorage.useremail;
					   if(admin=="admin@gmail.com"){
							$scope.hideMe=false;
							clearInterval(interval);
						}
						else{
							$scope.hideMe=true;
						clearInterval(interval);
						}
						
					$scope.name=$localStorage.username;
					$scope.gravatar=$localStorage.userimage;
							
						
					}, 1000);
				
			
			}
	
		});
	
  $scope.logOut = function () {
	Auth.logout();
			$location.path("/app/login");
			$window.localStorage.clear();
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
  }


})

.controller('forgotController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  $scope.resetpassword = function(user) {
      if(angular.isDefined(user)){
      Auth.resetpassword(user)
        .then(function() {
          //console.log("Password reset email sent successfully!");
          $location.path('/app/login');
        }, function(err) {
           //console.error("Error: ", err);
        });
      }
    };
	
	
})

.controller('homeController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
	

	
  var ref = new Firebase(FURL);
	 var presence = new Firebase('https://snev.firebaseio.com/precence');

		
			//managing logout presence- user control					
			
			presence.orderByChild("username").equalTo($localStorage.username).on("child_added", function(snapshot) {
                        var userKey = snapshot.key();

													 presence.child(userKey).set({ 'username': $localStorage.username, 'Status':'Logout','lastSeenAt':Firebase.ServerValue.TIMESTAMP });
				 });
  



    $scope.username=$localStorage.username;
})


.controller('loginController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils,$ionicSideMenuDelegate,$ionicPlatform) {
  var ref = new Firebase(FURL);
	var presence = new Firebase('https://snev.firebaseio.com/precence');
  var userkey = "";
							
								$scope.signIn = function (user) { 
											console.log("login success");
											if(angular.isDefined(user)){
											Utils.show();
											Auth.login(user)
												.then(function(authData) {
									

													ref.child('profile').orderByChild("id").equalTo(authData.uid).on("child_added", function(snapshot) {
													console.log(snapshot.key());
													userkey = snapshot.key();
													var obj = $firebaseObject(ref.child('profile').child(userkey));

													obj.$loaded()
														.then(function(data) {
														
													
												$localStorage.username = obj.name;
												$localStorage.useremail = obj.email;
												$localStorage.userimage = obj.gravatar;
												$localStorage.vehiclename=obj.vehicle_name;
												$localStorage.licenceplate=obj.licence_plate;
												$localStorage.mobileno=obj.mobile;
												$localStorage.uregdate=obj.registered_in;
												$localStorage.userkey = userkey;

												Utils.hide();
												
                       
												if($localStorage.useremail=="admin@gmail.com")
														{$state.go('app.adminHomepage');}
														
														else
														{$state.go('app.home');}
														
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


	
							
					
							 
	 	 $ionicSideMenuDelegate.canDragContent(false);
		$ionicPlatform.registerBackButtonAction(function(event) {
		if ($state.current.name=="app.login") { // In this condition user is prompted to exit app
			$ionicPopup.confirm({
				title: 'System warning',
				template: 'are you sure you want to exit?'
			}).then(function(res) {
				if (res) {
					ionic.Platform.exitApp();
				}
			});
		} else {
			history.back(); //this will force to continue to previous page
		}
	}, 100);

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



//isuru start

.controller('chargingRecordsCtrl', function($scope,MonthPicker,$localStorage,$ionicPopup) {
	
var uid = $localStorage.userkey;//getting current user

  var date = new Date();
$scope.year = date.getFullYear();
$scope.cmonthNum = date.getMonth();

var JanCost=0; var FebCost=0; var MarCost=0; var AprCost=0; var MayCost=0; var JunCost=0;
var JulCost=0; var AugCost=0; var SepCost=0; var OctCost=0; var NovCost=0; var DecCost=0;


	var ref = new Firebase("https://snev.firebaseio.com/charge_history");
	
		var yearlyReport = function() {
				  ref.orderByChild("user_id").equalTo(uid).on("value", function(snapshot) {
					  var userHistory=snapshot.val();
					 snapshot.forEach(function(userHisSnapshot) {
							 var userHistory =userHisSnapshot.val();
							  var myDate = new Date(userHistory.time);//geting date from timeStamp
							   var ncost=parseInt(userHistory.cost, 10);
							  
						 if(myDate.getFullYear()==$scope.year){
								   
							  if(myDate.getMonth()==0){JanCost=JanCost+ncost;}; 
							  if(myDate.getMonth()==1){FebCost=FebCost+ncost;}; 
							  if(myDate.getMonth()==2){MarCost=MarCost+ncost;};
							  if(myDate.getMonth()==3){AprCost=AprCost+ncost;};
							  if(myDate.getMonth()==4){MayCost=MayCost+ncost;}; 
							  if(myDate.getMonth()==5){JunCost=JunCost+ncost;}; 
							  if(myDate.getMonth()==6){JulCost=JulCost+ncost;};
							  if(myDate.getMonth()==7){AugCost=AugCost+ncost;};
							  if(myDate.getMonth()==8){SepCost=SepCost+ncost;};
							  if(myDate.getMonth()==9){OctCost=OctCost+ncost;};
							  if(myDate.getMonth()==10){NovCost=NovCost+ncost;};
							  if(myDate.getMonth()==11){DecCost=DecCost+ncost;};
						  }
						});	
							$scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
							  $scope.data = [
								[JanCost,FebCost,MarCost,AprCost,MayCost,JunCost,JulCost,AugCost,SepCost,OctCost,NovCost,DecCost]
							  ];
							  
							
				  }); 
		};
		yearlyReport();

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
$scope.cmonth = month[$scope.cmonthNum];


   MonthPicker.init({});
        $scope.buttonTap = function() {
            MonthPicker.show(function(res) {
				$scope.res=res;
				$scope.year=res.year;
				$scope.cmonth = month[res.month];
				$scope.cmonthNum=res.month;
				monthlyReport();	  
				    yearlyReport();
            });
        }
		
		
		var monthlyReport = function() {
				  ref.orderByChild("user_id").equalTo(uid).on("value", function(snapshot) {
				 
                      $scope.items = [];
					 var list = [];
						snapshot.forEach(function(userHisSnapshot) {
							 var userHistory =userHisSnapshot.val();
							 var myDate = new Date(userHistory.time);
									if(myDate.getMonth()==$scope.cmonthNum)
									{userHistory.id=userHisSnapshot.key();
									list.push(userHistory);}
							
						});	
						 $scope.items = list.reverse(); 
				  });
		};
		monthlyReport();
		
		 $scope.onItemDelete = function(taskid){
		$ionicPopup.confirm({
			title: 'Confirm Delete',
			content: 'Are you sure you want to delete?'
		}).then(function(res){
			if(res){
				 ref.child(taskid).remove();
				monthlyReport();
			}
		});
	};
  
})



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
		var prt = $scope.station.port;
		var hrs = $scope.station.hours;
		var cst = $scope.station.cost;
		var typ = $scope.station.type;
		var add = $scope.station.address;
		var cnt = $scope.station.contact;
		var ema = $scope.station.email;
		var web = $scope.station.web;
		
		 

	    var fb = new Firebase("https://snev.firebaseio.com/Stations_Details");

	    var newfb=fb.push({
		    latitude: lat,
		    longitude: lgt,
		    name: nme,
			port:prt,
			hours:hrs,
			cost:cst,
			type:typ,
			address:add,
			contact:cnt,
			email:ema,
			state:"active",
			website:web,

		}).then(function(newfb) {
		    $scope.static = {};
		    $scope.showAlert();
			var key=newfb.key();
			var firebaseObj = new Firebase("https://snev.firebaseio.com/user_status");
			
			firebaseObj.push({user_id: "",station_id: key,on_myWay: 0, in_theQueue: 0,charging:0,
							completed:0,time:"",}).then(function(ref) {
								$scope.static = {};
							}, function(error) {
								console.log("Error:adding first time", error);
							});
							
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
		  
		   google.maps.event.addListener(map, 'click', function(event) {
			marker.setPosition(event.latLng);
			scope.$parent.station.latitude = event.latLng.lat();
		
		    scope.$parent.station.longitude =event.latLng.lng();
		    scope.$apply();
        });


        }
    };
})

.controller('stationDetailCtrl', function($scope,$ionicPopup,$cordovaLaunchNavigator,$location,$localStorage,$ionicModal) {
	
		 $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

	var data = $localStorage.stationData;
		if(data=='')
		{console.log("Could not get station details");}
	

            $scope.name=data.name;
			$scope.port=data.port;
			$scope.hours= data.hours;
			$scope.cost=data.cost;
			$scope.address=data.address;
			$scope.contact=data.contact;
			$scope.email=data.email;
			$scope.website=data.website;


			$scope.launchNavigator = function() {
			 if (window.cordova) {
			var destination = [data.latitude,data.longitude];
				$cordovaLaunchNavigator.navigate(destination).then(function() {
				  console.log("Navigator launched");
				}, function (err) {	 //if fails google navigator 
				  console.log("Error in launching");
				  $location.path('/app/stationDirection');
				});
			} else {//if on browser
			 $location.path('/app/stationDirection');
				}
	  };
	  
	//funtions to call device features like dialer,email and web browser

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
	  
			var sid = $localStorage.stationDataID;
			var uid = $localStorage.userkey;
			
			
			   $scope.watchStatus = function () {
			var fire = new Firebase("https://snev.firebaseio.com/user_status");
				 var count=0;
				fire.orderByChild('station_id').equalTo(sid).once('value', function(snapshot){
					snapshot.forEach(function(userSnapshot) {
					var x = userSnapshot.val();
							if(x.user_id && ( (x.on_myWay==1) || (x.in_theQueue==1) || (x.charging==1) || (x.completed==1) ))
							{count++;}
					
			});
			var output="";
					if(count==0){
						output="Currently no one using station";
						$scope.hideView=true;
					}
					if(count==1){
						output="Only one person using the service";
					}
					if(count>1){
						output=count+" Peoples are currently using the service";
					}
		$scope.fullStatus=output;
			});
      };
	  
	  $scope.watchStatus();
			
	  
	  		      var firebaseObj = new Firebase("https://snev.firebaseio.com/user_status");
				  var x=0;
				  firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						
						if(station_status.user_id==""){
							status_id=snapshot.key();
							console.log();
							firebaseObj.child(status_id).update({user_id: uid});
						}
						if(station_status.user_id==uid){
							current_status=snapshot.val();
							if(current_status.on_myWay==1)
							{$scope.myway=true;}
							if(current_status.in_theQueue==1)
							{$scope.inqueue=true;}
							if(current_status.charging==1)
							{$scope.charge=true;}
							if(current_status.completed==1)
							{$scope.complete=true;}
							
						}			
					
                
				
				 var fire = new Firebase("https://snev.firebaseio.com/user_status");
				var has=0;
				fire.orderByChild('station_id').equalTo(sid).once('value', function(snapshot){
					snapshot.forEach(function(userSnapshot) {
					var x = userSnapshot.val();
					if(x.user_id==uid){
						has=1;
					}
			});
			
			if(has!=1 && x!=1 && station_status.user_id!=uid){
				fire.push({user_id: uid,station_id: sid,on_myWay: 0, in_theQueue: 0,charging:0,
							completed:0,time:""}).then(function(ref) {
								$scope.static = {};
							}, function(error) {
								
								});
								x=1;
		}
		
    });
	
	
});
				


	  
	  $scope.ToggleOnMyWay = function(toStatus){
		  
		  if(toStatus==true){
		  
				
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						if(station_status.user_id==uid){
							
							
							//updating the status by 1 by geeting the unique key
							status_id=snapshot.key();
							
							var onWay=station_status.on_myWay+1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({on_myWay: onWay,time:Firebase.ServerValue.TIMESTAMP});

							
							
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
		  $scope.watchStatus();
		  }
		  
		  else{
			  		
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						
						if(station_status.user_id==uid){
							
							
							//updating the status by 1 by geting the unique key
							status_id=snapshot.key();
							
							var onWay=station_status.on_myWay-1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({on_myWay: onWay});

							
							
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
			  
			  $scope.watchStatus();
		  }
		
			
		}

		
		  $scope.ToggleInQueue = function(toStatus){
		  
		  if(toStatus==true){
		  
				
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						if(station_status.user_id==uid){
							
							
							//updating the status by 1 by geeting the unique key
							status_id=snapshot.key();
							
							
							var inQu=station_status.in_theQueue+1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({in_theQueue: inQu,time:Firebase.ServerValue.TIMESTAMP});

							
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
		  $scope.watchStatus();
		  }
		  
		  else{
			  		
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						
						if(station_status.user_id==uid){
							
							
							//updating the status by 1 by geting the unique key
							status_id=snapshot.key();
							
							var inQu=station_status.in_theQueue-1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({in_theQueue: inQu});
	
							
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
			  $scope.watchStatus();
			  
		  }
		
			
		}
		
		
		
		$scope.ToggleCharging = function(toStatus){
		  
		  if(toStatus==true){
		  
				
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						if(station_status.user_id==uid){
							
							
							//updating the status by 1 by geeting the unique key
							status_id=snapshot.key();
							
							
							var charge=station_status.charging+1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({charging: charge,time:Firebase.ServerValue.TIMESTAMP});
							
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
		  $scope.watchStatus();
		  }
		  
		  else{
			  		
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						
						if(station_status.user_id==uid){
							
							
							//updating the status by 1 by geting the unique key
							status_id=snapshot.key();
							
							var charge=station_status.charging-1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({charging: charge});


						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
			  
			  $scope.watchStatus();
		  }
		  

}




$scope.ToggleCompleted = function(toStatus){
		  
		  if(toStatus==true){
		  
				
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						if(station_status.user_id==uid){
							

							 // Triggered on a button click, or some other target
							var onComplete = function() {
							  $scope.data = {};

							  // An elaborate, custom popup
							  var myPopup = $ionicPopup.show({
								template: '<input type="text" ng-model="data.val" ng-pattern="/^[0-9]{1,4}$/"  >',
								title: 'Enter Your Cost on Charging',
								subTitle: 'Numbers only',
								scope: $scope,
								buttons: [
								  { text: 'Cancel' },
								  {
									text: '<b>Save</b>',
									type: 'button-positive',
									onTap: function(e) {
									  if (!$scope.data.val) {
										//don't allow the user to close unless he enters val 
										e.preventDefault();
									  }
									 
									  else {
										  
										   var charRef = new Firebase("https://snev.firebaseio.com/charge_history");
										   charRef.push({user_id: uid,station_name: $scope.name,cost: $scope.data.val, time:Firebase.ServerValue.TIMESTAMP}), 
										   function(error) {
												console.log("Error:adding first time", error);
											};
						     
									  }
									}
								  }
								]
							  });
  
							 };
							 
							//updating the status by 1 by geeting the unique key
							status_id=snapshot.key();
							
							
							var comp=station_status.completed+1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({completed: comp,time:Firebase.ServerValue.TIMESTAMP}, onComplete);
							 
							 
							

							
							
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
		  $scope.watchStatus();
		  }
		  
		  else{
			  		
			//loading only current stations
			
				firebaseObj.orderByChild("station_id").equalTo(sid).on("child_added", function(snapshot) {
				 
                        var station_status = snapshot.val();
						
						if(station_status.user_id==uid){
							
							//updating the status by 1 by geting the unique key
							status_id=snapshot.key();
							
							var comp=station_status.completed-1;	
							 var statusRef = new Firebase("https://snev.firebaseio.com/user_status");
						     statusRef.child(status_id).update({completed: comp});
	
						}
						
				 }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
			  
			  $scope.watchStatus();
		  }
		

		
			
		}
		
		
		


})




.controller('mapCtrl', function($scope,$cordovaGeolocation,$firebase,$location, $localStorage) {
	
		
			var userLatitude="7.831180";
			var userLongitude="80.213107";
			 var nlatLng = new google.maps.LatLng(userLatitude,userLongitude);
		

            var mapOptions = {
                center: nlatLng,
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                var marker = new google.maps.Marker({
                    
                    animation: google.maps.Animation.DROP,
                    position: nlatLng,
					icon: 'img/me.png'

                });
				
				 // Create the search box and link it to the UI element.
				var input = document.getElementById('pac-input');
				var searchBox = new google.maps.places.SearchBox(input);
				$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				// Bias the SearchBox results towards current map's viewport.
				$scope.map.addListener('bounds_changed', function() {
				  searchBox.setBounds($scope.map.getBounds());
				});

				// Listen for the event fired when the user selects a prediction and retrieve
				// more details for that place.
				searchBox.addListener('places_changed', function() {
				  var places = searchBox.getPlaces();

				  if (places.length == 0) {
					return;
				  }

				  // For each place, get the icon, name and location.
				  var bounds = new google.maps.LatLngBounds();
				  places.forEach(function(place) {
					if (!place.geometry) {
					  console.log("Returned place contains no geometry");
					  return;
					}

					if (place.geometry.viewport) {
					  // Only geocodes have viewport.
					  bounds.union(place.geometry.viewport);
					} else {
					  bounds.extend(place.geometry.location);
					}
				  });
				  $scope.map.fitBounds(bounds);
				});
		
				// End of search box and link it to the UI element.
				

                var infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });

                var firebaseObj = new Firebase("https://snev.firebaseio.com/Stations_Details");
				
			//loading only active stations
			
				firebaseObj.orderByChild("state").equalTo("active").on("child_added", function(snapshot) {
				 
				

                        var station = snapshot.val();
						if(station.contact==""){station.contact="not provided!"};
						
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
								 var id = snapshot.key();
								 var data = snapshot.val();
								 $localStorage.stationData=data;
								  $localStorage.stationDataID=id;
								   stationinfoWindow.close();
								 $location.path("/app/stationDetail");
								 window.location.assign("#/app/stationDetail");
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
								 var id = snapshot.key();
								 var data = snapshot.val();
								  $localStorage.stationData=data;
								  $localStorage.stationDataID=id;
								   stationinfoWindow.close();
								 $location.path("/app/stationDetail");
								 window.location.assign("#/app/stationDetail");
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
								 var options = {timeout: 10000, enableHighAccuracy: true};
								$cordovaGeolocation.getCurrentPosition(options).then(function(position){
								$localStorage.userLatitude=position.coords.latitude;
								$localStorage.userLongitude=position.coords.longitude;
								 var ulatLng = new google.maps.LatLng($localStorage.userLatitude,$localStorage.userLongitude);
								$scope.map.setCenter(ulatLng);
								marker.setPosition(ulatLng);//setting marker position
								marker.setMap($scope.map);//setting marker me
								$scope.map.setZoom(zoom + 5);
								}, function(error){
								console.log("Could not get location");
								});
							me=false;
						 }
						 
						 else
						 {
							marker.setMap(null);//removing marker me
							$scope.map.setCenter(nlatLng);
							$scope.map.setZoom(zoom);
							me=true;
						 }
						};
						
            });
			
				$scope.$on('$ionicView.afterEnter', function(){
				if ( angular.isDefined( $scope.map ) ) {
					google.maps.event.trigger($scope.map, 'resize');
				}
			  });


})

.controller('stationDirectionCtrl', function($scope,$localStorage,$firebase,$location) {
       var directionsService = new google.maps.DirectionsService();
         var directionsDisplay = new google.maps.DirectionsRenderer();
    
         var map = new google.maps.Map(document.getElementById('addmap'), {
           zoom:7,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         });
        
         directionsDisplay.setMap(map);
         directionsDisplay.setPanel(document.getElementById('panel'));
		
			
			var data=$localStorage.stationData;
	
		
		
		var cpostion = {lat: $localStorage.userLatitude, lng: $localStorage.userLongitude};
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

})

.controller('stationStatusCtrl', function($scope,$firebase,$localStorage) {
	
	$scope.ViewAllStatus = function () {
	var sid = $localStorage.stationDataID;
	  
	  		      var firebaseObj = new Firebase("https://snev.firebaseio.com/user_status");
				  firebaseObj.orderByChild("station_id").equalTo(sid).on("value", function(snapshot) {
				 
                      $scope.items = [];
					 var list = [];
					   var station_status =snapshot.val();
						
						snapshot.forEach(function(userSnapshot) {
							
							var myway=userSnapshot.val().on_myWay;
							var que=userSnapshot.val().in_theQueue;
							var charging=userSnapshot.val().charging;
							var completed=userSnapshot.val().completed;
					
									if(myway!=0||que!=0||charging!=0||completed!=0){
											 var station_status =userSnapshot.val();
											 
											 list.push(station_status);
									}
														
						});
						
						 $scope.items = list; 
		
						$scope.getName= function(uid) {
							
							 var firebaseObj2 = new Firebase("https://snev.firebaseio.com/profile");
						  firebaseObj2.on("value", function(snap){
							  
							  	snap.forEach(function(userSnapshot) {
					
									if(userSnapshot.key()==uid){
											var uname=userSnapshot.val().name;
											$scope.myname=uname;
											
											
										  }
								}
								);
								});
							
						}; 
						
					
                });
				
	};
	$scope.ViewAllStatus();

	 $scope.colorCodeArray = [
         "#FDD017",
         "#F75D59",
         "#F660AB",
         "#9E7BFF",
         "#607D8B",
         "#039BE5",
         "#009688",
    ];

})
//isuru end


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


.controller('stationChatCtrl', function($scope) {

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



.controller('loadPostCtrl', function($scope ,$ionicPopup, $localStorage){
	$state.reload();
	var ref = new Firebase('https://snev.firebaseio.com/posts');
	
	ref.on("value", function(snapshot,prevChildKey) {
		  $scope.$apply(function(){
			$scope.loadposts = snapshot.val();
			//console.log(prevChildKey.key());

		  });
		});
})


//post controller
.controller('postCtrl', function($scope ,$ionicPopup, $localStorage,$firebaseArray){
	var ref = new Firebase('https://snev.firebaseio.com/posts');
	 var ref2 = new Firebase('https://snev.firebaseio.com/comments');
	  var username=$localStorage.username;

	 //alert if sucessful
								var checkLike = function(error) {
									if (error) {
										 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>',template:'Synchronization failed'
                              	 });				
									} else {
											 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>', template:'You have Successfuly Liked the post'
                              	 });
									}
								};

									var rcheckLike = function(error) {
									if (error) {
										 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>',template:'Synchronization failed'
                              	 });				
									} else {
											 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>', template:'You have Successfuly Removed Like from the post'
                              	 });
									}
								};

							var checkDisLike = function(error) {
									if (error) {
										 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>',template:'Synchronization failed'
                              	 });				
									} else {
											 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>', template:'You have Successfuly disliked the post'
                              	 });
									}
								};
							var checkReport = function(error) {
									if (error) {
										 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>',template:'Synchronization failed'
                              	 });				
									} else {
											 var alertPopup = $ionicPopup.alert({
                                 title: 'Successful! <i class="ion-checkmark-round"></i>', template:'You have Successfuly Reported the post'
                              	 });
									}
								};

	 		$scope.addlike = function(title) {
				var title1=title;
						//get key of child equals to ==title
						 ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
					  var value=snapshot.key();
						var data = snapshot.val();
						var noofl=data.noOfLikes;
						var postsreflike = new Firebase('https://snev.firebaseio.com/posts');
						var likedRef=postsreflike.child(value).child("liked");
												
									//load specific items to check existing
										likedRef.orderByChild("user").equalTo($localStorage.username).once("value", function(snapshot) {
											userkey = snapshot.val();
										
											if(userkey==null){
														postsreflike.child(value).update({ noOfLikes: noofl+1},checkLike);
														likedRef.push({user:username});
													
											}else{
												
													likedRef.orderByChild("user").equalTo($localStorage.username).once("child_added", function(dsnapshot) {
														var value1=dsnapshot.key();

														likedRef.child(value1).remove();		
														postsreflike.child(value).update({ noOfLikes: noofl-1},rcheckLike);

													});

												}
													
												});
						});
					};


				$scope.adddislike= function(title) {
				var title1=title;
						//get key of child equals to ==title
						 ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
					  var value=snapshot.key();
						var data = snapshot.val();
						var noofl=data.noOfDisLikes;
						var postsreflike = new Firebase('https://snev.firebaseio.com/posts');
						var likedRef=postsreflike.child(value).child("Disliked");
												
									//load specific items to check existing
										likedRef.orderByChild("user").equalTo($localStorage.username).once("value", function(snapshot) {
											userkey = snapshot.val();
										
											if(userkey==null){
														postsreflike.child(value).update({ noOfDisLikes: noofl+1},checkDisLike);
														likedRef.push({user:username});
													
											}else{
													
													likedRef.orderByChild("user").equalTo($localStorage.username).once("child_added", function(dsnapshot) {
														var value1=dsnapshot.key();

														likedRef.child(value1).remove();		
														postsreflike.child(value).update({ noOfDisLikes: noofl-1},rcheckLike);

													});

												}
													
												});
						});
					};

					
 					$scope.report = function(title) {
			     	var title1=title;
						//get key of child equals to ==title
						 ref.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
					  var value=snapshot.key();
						var data = snapshot.val();
						var noofl=data.noOfReports;
						var postsreflike = new Firebase('https://snev.firebaseio.com/posts');
						var likedRef=postsreflike.child(value).child("reported");
												
									//load specific items to check existing
										likedRef.orderByChild("user").equalTo($localStorage.username).once("value", function(snapshot) {
											userkey = snapshot.val();
										
											if(userkey==null){
														postsreflike.child(value).update({ noOfReports: noofl+1},checkReport);
														likedRef.push({user:username});
													
											}else{
													
													likedRef.orderByChild("user").equalTo($localStorage.username).once("child_added", function(dsnapshot) {
														var value1=dsnapshot.key();

														likedRef.child(value1).remove();		
														postsreflike.child(value).update({ noOfReports: noofl-1},rcheckLike);

													});

												}
													
												});
						});
					};


})



// loading post

.controller("myPostHistorry", function($scope, $firebaseArray,$localStorage) {


  var ref = new Firebase("https://snev.firebaseio.com/posts");
	var username= $localStorage.username;

		var query = ref.orderByChild('username').equalTo(username);
	$scope.imgs = $firebaseArray(query);	

})


// loading post

.controller("base64Ctrl", function($scope, $firebaseArray) {

  var img = new Firebase("https://snev.firebaseio.com/posts");


  $scope.imgs = $firebaseArray(img);

})




//adding a post 
.controller('newPostController', function($scope, $http, $state,$ionicPopup,$firebaseArray, $localStorage,$firebase) {
   $scope.postForm = function(title,description){
     
      	 var username= $localStorage.username;
		   var userImg=$localStorage.userimage;
		   
			
		 var messageListRef = new Firebase('https://snev.firebaseio.com/posts');
     var newMessageRef = messageListRef.push();
    
  var ref = new Firebase("https://snev.firebaseio.com");

  var img = new Firebase("https://snev.firebaseio.com/posts");
  $scope.imgs = $firebaseArray(img);




  var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
  	$scope.uploadFile = function() {
    var sFileName = $("#nameImg").val();
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          var filesSelected = document.getElementById("nameImg").files;
          if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

              fileReader.onload = function(fileLoadedEvent) {
              var textAreaFileContents = document.getElementById(
                "textAreaFileContents"
              );


              $scope.imgs.$add({
                					timeStamp: Firebase.ServerValue.TIMESTAMP,
                					image: fileLoadedEvent.target.result,
								 	   title: title,
									   description: description ,
										 username:username,
										 noOfLikes: 0,
										 noOfDisLikes: 0 ,
										 noOfReports: 0,
										userimage:userImg,
										noOfcomments:0
      
              });
            };

            fileReader.readAsDataURL(fileToLoad);
          }
          break;
        }
      }

      if (!blnValid) {
        alert('File is not valid');
        return false;
      }
    }

    return true;
  }

  $scope.deleteimg = function(imgid) {
    var r = confirm("Do you want to remove this image ?");
    if (r == true) {
      $scope.imgs.forEach(function(childSnapshot) {		
        if (childSnapshot.$id == imgid) {
            $scope.imgs.$remove(childSnapshot).then(function(ref) {
              ref.key() === childSnapshot.$id; // true
            });
        }
      });
    }
  }//image Upload controller end


         $scope.title="";
         $scope.description="";


      };
})




.controller('cmntController', function($scope ,$ionicPopup,$location,$localStorage) {

	$scope.addComment = function(comment1,title1) {
			
				var user=$localStorage.username	;
				 var userImg=$localStorage.userimage;
				 $scope.userImgg=userImg;
				var postRef = new Firebase('https://snev.firebaseio.com/posts');

 					postRef.orderByChild("title").equalTo(title1).on("child_added", function(snapshot) {
					  var value=snapshot.key();
						var data = snapshot.val();
						var noOfCommentss=data.noOfcomments;
						
						var postsreflike = new Firebase('https://snev.firebaseio.com/posts');
						var selectPostRef=postsreflike.child(value).child("comments");

							if($scope.comment!=""){
									selectPostRef.push({
																	'comment':comment1,
																	"Cdate" :Firebase.ServerValue.TIMESTAMP,
																	'username':user,
																	'title':title1,
																	'userimage':userImg
											}).then(alert("Comment added sucessfully"));

											postsreflike.child(value).update({ noOfcomments: noOfCommentss+1});
									
							}else{
								alert("Invalid comment");
							}

									
					 });
					 $scope.comment="";
  };


})




//get selected post and store
.controller('newselect', function($scope ,$ionicPopup,$location,$window,$localStorage,$state) {

	$scope.setSelectedPost = function(title1) {
   
			$localStorage.settitle=title1;
  //window.localStorage.setItem("settitle",title1);

			$state.go('app.viewpost');
  	};
  })



  // get selected post deatils ; load comments and posts
  .controller('getSelectedpost', function($scope ,$firebaseArray,$ionicPopup,$window,$localStorage){
			
				var SelectdP=$localStorage.settitle;

			var postRef = new Firebase('https://snev.firebaseio.com/posts');

 					postRef.orderByChild("title").equalTo(SelectdP).on("child_added", function(snapshot) {
					  var value=snapshot.key();
						var data = snapshot.val();
						
						var postsreflike = new Firebase('https://snev.firebaseio.com/posts');
						var selectPostRef=postsreflike.child(value).child("comments");
						$scope.mycomments = $firebaseArray(selectPostRef);
						

										
					 });

						var query = postRef.orderByChild('title').equalTo(SelectdP);
						$scope.myposts = $firebaseArray(query);


					 $scope.removeComment = function(commentselected) {
	
						 
							var confirmPopup = $ionicPopup.confirm({
								title: 'Title',
								template: 'Are you sure?'
							});

							confirmPopup.then(function(res) {
								if(res) {
											postRef.orderByChild("title").equalTo(SelectdP).on("child_added", function(snapshot) {
											var value=snapshot.key();
											var data = snapshot.val();
											
											var postsreflike = new Firebase('https://snev.firebaseio.com/posts');
											var SelectedComments=postsreflike.child(value).child("comments");
																		

															SelectedComments.orderByChild("comment").equalTo(commentselected).once("child_added", function(csnapshot) {
																var commentKey=csnapshot.key();
																//var data = snapshot.val();
																
																SelectedComments.child(commentKey).remove().then(alert ("Sucessfully deleted"));

															});	


										});



								} else {
									console.log('Not sure!');
								}
							});
		
   						};
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


//  loadProfileDetails controller ->used in sidemenu and loading friendlist
.controller('loadProfDetails', function($scope ,$ionicPopup,$window,$localStorage,$firebaseObject) {
		
	var ref = new Firebase('https://snev.firebaseio.com/profile');
 var key=$localStorage.userkey;

	ref.orderByKey().equalTo(key).once("value", function(snapshot,prevChildKey) {
	
		  
		   	$scope.myprofile = snapshot.val();
		
		});

  })


  

// loading profile 

.controller('Loadprofile', function($scope ,$ionicPopup, $localStorage,$location,$firebaseArray,$firebaseObject){

	var ref = new Firebase('https://snev.firebaseio.com/profile');

  var key=$localStorage.userkey;
  	
	 var name=$localStorage.username;


	 	var query = ref.orderByChild('name').equalTo(name);
		$scope.myprofile = $firebaseArray(query);

				
				
		//load friend list
						ref.orderByChild("name").equalTo(name).on("child_added", function(snapshot) {
											
			    			var nameSnapshot = snapshot.child("friends");
								$scope.friendlist = nameSnapshot.val();
//								console.log(nameSnapshot.val());
					 	});
									



/*
	var ref = new Firebase('https://snev.firebaseio.com/profile');

  var name=$localStorage.username;
	var selectedprof=$localStorage.setFname;

					var query = ref.orderByChild('name').equalTo(selectedprof);
					$scope.myprofile = $firebaseArray(query);	

					ref.orderByChild("name").equalTo(selectedprof).on("child_added", function(snapshot) {
					
					var nameSnapshot = snapshot.child("friends");
					$scope.friendlist = nameSnapshot.val();
					
				});


*/

															
				$scope.msg = function(selectedprofz) {//set selected profile

				$localStorage.setFname=selectedprofz;
				localStorage['sendTo']=selectedprofz ;
			//	loaclStorage['userId']=$localStorage.uid;
				localStorage['fromUser']=name;
				$location.path("/app/UserMessages");
				//console.log("UserMessages");
				
 				 }

				    $scope.call = function () {
							//alert($localStorage.mobileno);
						if(	$localStorage.mobileno==null)
							{$ionicPopup.alert({ template: 'contact not provided!!'});}
							else
						window.open('tel:' + $localStorage.mobileno, '_system');
			    	};

     				 $scope.mail = function () {
						 // alert($localStorage.useremail);
						if( $localStorage.useremail==null)
							{$ionicPopup.alert({ template: 'Email not provided!!'});}
							else
								window.open('mailto:' +$localStorage.useremail, '_system');
					};



						$scope.follow = function(follower) {
						
								ref.orderByChild("name").equalTo(follower).once("child_added", function(snapshot) {
								var profilekey = snapshot.key();
								if(snapshot.val().name!=$localStorage.username){
											ref.orderByChild("name").equalTo($localStorage.username).once("child_added", function(mysnapshot) {
												var userkey = mysnapshot.key();
												//	console.log(" ---------->"+mysnapshot.val());	
												var path='https://snev.firebaseio.com/profile/'+userkey+'/gravatar';
												var tempref = new Firebase(path);
												tempref.once("value", function(imagesnapshot) {
													var userImage=imagesnapshot.val();
												 
													var reprofile= new Firebase('https://snev.firebaseio.com/profile/'+profilekey+'/friends');
																	
									//load specific items /check if exist
										reprofile.orderByChild("name").equalTo($localStorage.username).once("value", function(snapshot) {
										
													userkey = snapshot.val();
											

											if(userkey==null){
														reprofile.push({ 'name': $localStorage.username, 'image':userImage });
														// .then(alert("sucessfully added"));//add my image
													
												  
											}else{
														reprofile.orderByChild("name").equalTo($localStorage.username).once("child_added", function(dsnapshot) {
														var value1=dsnapshot.key();

														reprofile.child(value1).remove();		
														

													});
													

													}
																myfunct();
												});

		
									
									});
									})


								}else{

									alert("You cant follow your account");
								}
								});
						}


													function myfunct(){ 	//loadFriendlist custom function.
												
													ref.orderByChild("name").equalTo(name).on("child_added", function(snapshot) {
																var nameSnapshot = snapshot.child("friends");
																	$scope.friendlist = nameSnapshot.val();
															//	console.log(nameSnapshot);
														});
													}
						
	
})



// load friends profile

.controller('loadFProfileCtrl', function($scope ,$ionicPopup,$location, $localStorage,$firebaseArray){

	var ref = new Firebase('https://snev.firebaseio.com/profile');

  var name=$localStorage.username;
	var selectedprof=$localStorage.setFname;

					var query = ref.orderByChild('name').equalTo(selectedprof);
					$scope.myprofile = $firebaseArray(query);	

					ref.orderByChild("name").equalTo(selectedprof).on("child_added", function(snapshot) {
					
					var nameSnapshot = snapshot.child("friends");
					$scope.friendlist = nameSnapshot.val();
					
				});


				$scope.msg = function(selectedprofz) {//set selected profile

				$localStorage.setFname=selectedprofz;
				localStorage['sendTo']=selectedprofz ;
			//	loaclStorage['userId']=$localStorage.uid;
				localStorage['fromUser']=name;
				$location.path("/app/UserMessages");
				//console.log("UserMessages");
				
 				 }

				    $scope.call = function () {
							//alert($localStorage.mobileno);
						if(	$localStorage.mobileno==null)
							{$ionicPopup.alert({ template: 'contact not provided!!'});}
							else
						window.open('tel:' + $localStorage.mobileno, '_system');
			    	};

     				 $scope.mail = function () {
						 // alert($localStorage.useremail);
						if( $localStorage.useremail==null)
							{$ionicPopup.alert({ template: 'Email not provided!!'});}
							else
								window.open('mailto:' +$localStorage.useremail, '_system');
					};


						$scope.follow = function(follower) {
						
								ref.orderByChild("name").equalTo(follower).once("child_added", function(snapshot) {
								var profilekey = snapshot.key();

											ref.orderByChild("name").equalTo($localStorage.username).once("child_added", function(mysnapshot) {
												var userkey = mysnapshot.key();
														
												var path='https://snev.firebaseio.com/profile/'+userkey+'/gravatar';
												var tempref = new Firebase(path);
												tempref.once("value", function(imagesnapshot) {
													var userImage=imagesnapshot.val();
												 
													var reprofile= new Firebase('https://snev.firebaseio.com/profile/'+profilekey+'/friends');
																	
									//load specific items /check if exist
										reprofile.orderByChild("name").equalTo($localStorage.username).once("value", function(snapshot) {										
													userkey = snapshot.val();
											if(userkey==null){
														reprofile.push({ 'name': $localStorage.username, 'image':userImage });
														// .then(alert("sucessfully added"));//add my image
														alert("you are now following "+follower);
												  
											}else{
														
														reprofile.orderByChild("name").equalTo($localStorage.username).once("child_added", function(dsnapshot) {
														var value1=dsnapshot.key();

														reprofile.child(value1).remove();	
														alert("Unfollowed");

													});														
													}
													myfunct1();
																
												});

		
									
									});
									})
								});

																	function myfunct1(){ 	//loadFriendlist custom function.
																		ref.orderByChild("name").equalTo(follower).on("child_added", function(snapshot) {
																							var nameSnapshot = snapshot.child("friends");
																								$scope.friendlist = nameSnapshot.val();
																						//	console.log(nameSnapshot);
																					});	
																	}
						
						}


													

})

//loadProfileDDetails anywhere
.controller('loadProfileDetails', function($scope ,$ionicPopup, $localStorage,$firebaseArray){
 var userToBeLoaded=$localStorage.username;
	var ref = new Firebase('https://snev.firebaseio.com/profile');
  var username=$localStorage.username;
	  	var query1 = ref.orderByChild('name').equalTo(username);
					$scope.myprofile = $firebaseArray(query1);	
})

// edit profile

.controller('editProfile', function($scope ,$ionicPopup, $localStorage,$firebaseArray,$location){

	var ref = new Firebase('https://snev.firebaseio.com/profile');
  var username=$localStorage.username;

	
		

  var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

  	$scope.uploadFile = function() {
		
    var sFileName = $("#nameImg").val();
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          var filesSelected = document.getElementById("nameImg").files;
          if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

              fileReader.onload = function(fileLoadedEvent) {
              var textAreaFileContents = document.getElementById(
                "textAreaFileContents"
              );

			
			ref.orderByChild("name").equalTo(username).on("child_added", function(snapshot) {
        		var key=snapshot.key();
	
			ref.child(key).update({ gravatar:fileLoadedEvent.target.result});
			
			
        });

			
            };

            fileReader.readAsDataURL(fileToLoad);
          }
          break;
        }
      }

      if (!blnValid) {
        alert('File is not valid');
        return false;
      }
    }

    return true;
	
  }
		

//update profile

	$scope.updateProfile = function(description,contact,sname,fname,userImg,lPlate,Vname) {
		var lng=$localStorage.profileEditLng;
		var lat=$localStorage.profileEditLat;
		//alert(description+contact+sname+fname+userImg+lPlate+Vname+ ""+lng+""+lat);
    	ref.orderByChild("name").equalTo(username).on("child_added", function(snapshot) {
        var key=snapshot.key();
	
        	ref.child(key).update({ description:description,sname:sname,mobile:contact,licence_plate:lPlate,vehicle_name:Vname,hometownlng:$localStorage.profileEditLng,hometownlat:$localStorage.profileEditLat});

			
        });


	

        var alertPopup = $ionicPopup.alert({
        title: 'Successful! <i class="ion-checkmark-round"></i>',
        template:'You have Successfuly Updated'
         });

	 

  	};

	
//load profile
		     	var query1 = ref.orderByChild('name').equalTo(username);
					$scope.myprofile = $firebaseArray(query1);	
			//		alert("this one");

})


//new edit profile with map 



.directive('addmapq', function($localStorage) {
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
				icon: 'img/me.png',
			    draggable:true
		  });

		  google.maps.event.addListener(marker, 'dragend', function(evt){
		   // scope.$parent.station.latitude = evt.latLng.lat();
		  //  scope.$parent.station.longitude = evt.latLng.lng();
		    scope.$apply();
		  });
		  
		   google.maps.event.addListener(map, 'click', function(event) {
			marker.setPosition(event.latLng);
		
		//	alert(event.latLng.lat() +" "+ event.latLng.lng() );
			$localStorage.profileEditLng=event.latLng.lng();
			$localStorage.profileEditLat=event.latLng.lat();
		
		    scope.$apply();
        });


        }
    };
})





.controller('presenceController', function($scope) {
			var presence = new Firebase('https://snev.firebaseio.com/precence'); 
    var presenceReff = presence.child();
    presenceReff.onDisconnect().set("disconnected!");
})



.controller('messengerCtrl', function($scope,$localStorage) {
		
		$scope.name=$localStorage.username;
		var presence = new Firebase('https://snev.firebaseio.com/precence'); 
		
		presence.on("value", function(snapshot,prevChildKey) {
		  $scope.$apply(function(){
					$scope.onlineUsers = snapshot.val();
		  });
		});

		
})



//loading friendlist 
.controller('friendslistCntrl', function($scope, $http, $ionicPopup,$firebaseArray, $localStorage,$location) {
		var username=$localStorage.username;
 var ref = new Firebase("https://snev.firebaseio.com/profile/"+$localStorage.userkey);
var refChild=ref.child("friends");
		$scope.myprofile = $firebaseArray(ref);
	//	console.log($firebaseArray(refChild));
		 $scope.friends = $firebaseArray(refChild);

  

				//set selected profile
				$scope.setFProfile = function(selectedprofz) {
				$localStorage.setFname=selectedprofz;
				$location.path("/app/friendProfile");
			//	console.log("set profile");
				
 				 }

									//set selected profile
				$scope.message = function(selectedprofz) {
				$localStorage.setFname=selectedprofz;
				localStorage['sendTo']=selectedprofz ;
			//	loaclStorage['userId']=$localStorage.uid;
				localStorage['fromUser']=username;
				$location.path("/app/UserMessages");
			//	console.log("UserMessages");
				
 				 }


	})





	
//loading loadUsers 
.controller('loadUsers', function($scope, $http, $state,$ionicPopup,$firebaseArray, $localStorage,$location,$firebase) {

 
     
  var username= $localStorage.username;
	$scope.name=username;


  var ref = new Firebase("https://snev.firebaseio.com/profile");

						var reprofile= new Firebase('https://snev.firebaseio.com/profile/');
										$scope.friends = $firebaseArray(reprofile);
										


				//set selected profile
				$scope.setFProfile = function(selectedprofz) {
				$localStorage.setFname=selectedprofz;
				$location.path("/app/friendProfile");
			//	console.log("set profile");
				
 				 }

	





	})




// Asanka end

//report post
.controller ('adminReportPostCtrl', function($scope, $http,$firebaseArray) {
	var reportPostRef = new Firebase('https://snev.firebaseio.com/posts');
	$scope.reports = $firebaseArray(reportPostRef);
	console.log('$scope.reports');
})


//Make Appointment
 .controller ('makeAppointmentCtrl' , function($scope, $http, $state,$ionicPopup,$firebaseArray) {
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
		 var list = [];
		 var fb = new Firebase("https://snev.firebaseio.com/Stations_Details");
				fb.on('value', function(snapshot){
						snapshot.forEach(function(stationSnapshot) {
							 var station =stationSnapshot.val();
									list.push(station.name);
							
						});					 
				});
		$scope.names=list;
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

.controller('finecrud',  function($scope,$firebaseArray,$rootScope,$ionicPopup){
	
	$scope.editFormSubmit = function() {
    if($scope.exampleForm.$valid)
      console.log('saving task'); // save $scope.user object
    else
      console.log('Unable to save. Validation error!');
 }

var myfine = new Firebase('https://snev.firebaseio.com/profile');


$scope.fines = $firebaseArray(myfine);

function clearForm(){
	$scope.name="";
    $scope.id="";
    $scope.mobile="";
    $scope.vehicle_name="";
    $scope.licence_plate="";
   $scope.email="";
  
}

$scope.addFormSubmit=function(){

$scope.fines.$add({
    name:$scope.name,
    mobile:$scope.mobile,
    registered_in:$scope.date, 
    
});
clearForm();
}

$scope.showfine=function(fine){
$scope.id=fine.$id;
$scope.editFormShow=true;
$scope.addFormShow=false;
$scope.name=fine.name;
$scope.mobile=fine.mobile;
$scope.licence_plate=fine.licence_plate;
$scope.vehicle_name=fine.vehicle_name;
$scope.email=fine.email;

	

}

$scope.editFormSubmit = function(){
    var id =$scope.id;
    var child = $scope.fines.$getRecord(id); 
	
    child.name=$scope.name,
    child.mobile=$scope.mobile,
    child.licence_plate=$scope.licence_plate, 
	child.vehicle_name=$scope.vehicle_name,
	child.email=$scope.email;
   
    $scope.fines.$save(child);
	
	clearForm();
}

		
$scope.deletefine = function(fine){
    
	 $scope.showConfirm = function() {
	
      var confirmPopup = $ionicPopup.confirm({
         title: 'Warnning !!!',
         template: 'Do you really want to delete?'
      });

      confirmPopup.then(function(res) {
         if(res) {
            console.log('Yes');
			$scope.fines.$remove(fine);
			
			var alertPopup = $ionicPopup.alert({
		title: 'Successfully deleted! <i class="ion-checkmark-round"></i>',
		template:'You have Successfuly deleted the user' 
		});
         } else {
            console.log('No');
         }
      });
		
   };
    $scope.showConfirm();
	
    clearForm();
}

})


.controller('adminStationRecordsCtrl', function($scope,$firebaseArray,$rootScope,$ionicPopup) {

    var viewStationRef = new Firebase('https://snev.firebaseio.com/Stations_Details');
		var load=function(){
		 viewStationRef.on("value", function(snapshot) {
				 
                      $scope.stations = [];
					 var list = [];
						snapshot.forEach(function(stationSnapshot) {
							 var valstation=stationSnapshot.val();
									valstation.id=stationSnapshot.key();
									list.push(valstation);
							
						});	
						 $scope.stations = list.reverse(); 
				  });
};
load();
				$scope.onItemDelete = function(taskid){
		$ionicPopup.confirm({
			title: 'Confirm Delete',
			content: 'Are you sure you want to delete?'
		}).then(function(res){
			if(res){
				 viewStationRef.child(taskid).remove();
				load();
			}
		});
	};
	
				$scope.onItemActive = function(taskid,state){
					if(state=="active"){
		$ionicPopup.confirm({
			title: 'Confirm Deactivation',
		}).then(function(res){
			if(res){
				 viewStationRef.child(taskid).update({state: "deactive"});
				load();
			}
		});
					}
					
					else if(state=="deactive"){
						$ionicPopup.confirm({
			title: 'Confirm Activation',
		}).then(function(res){
			if(res){
				 viewStationRef.child(taskid).update({state: "active"});
				load();
			}
		});
					}
		
	};
	
	

	
})

//user view notices------------------------------------------------------------------
.controller('viewNewsPageCtrl', function ($scope,$firebaseArray, $ionicSlideBoxDelegate) {

var viewNewsRef1 = new Firebase('https://snev.firebaseio.com/notice');

		 
    $scope.posts = $firebaseArray(viewNewsRef1);
  $scope.myTitle = 'Notice';


  $scope.groups = [];
  for (var i = 0; i < 10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j = 0; j < 2; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  $scope.currentSlide = 0;
  $ionicSlideBoxDelegate.slide(0);
				$ionicSlideBoxDelegate.update();

})
// admin create notice----------------------------------------------------------------------
.controller('noticeController', function($scope, $http, $state,$ionicPopup) {
  $scope.noticePostForm = function(topic,notice,date) {

    var noticeRef1 = new Firebase('https://snev.firebaseio.com/notice');
     var noticeRef1 = noticeRef1.push();
	 
	//pass the data to DB ---------------------------------------------------------------
     var noticeID = noticeRef1.key();
	 
       noticeRef1.set({ 'topic': topic,   'notice': notice, 'date':Firebase.ServerValue.TIMESTAMP});
       var path = noticeRef1.toString();

		//alert successfully add  0
		var alertPopup = $ionicPopup.alert({
		title: 'Successful! <i class="ion-checkmark-round"></i>',
		template:'You have Successfuly added the notice' 
		});

         $scope.topic="";
		 $scope.notice="";
		// $scope.date="";
			

	


  };
//End create notice-------------------------------------------------------------------------

//Cleare the fields.------------------------------------------------
  $scope.noticePostForm2 = function(topic,date,notice) {
  		$scope.topic="";
         $scope.date="";
         $scope.notice="";
  };
});
