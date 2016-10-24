
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
'Use Strict';
angular.module('app', ['ionic','ngCordovaOauth','chart.js','ionic-monthpicker','ngStorage','ngMessages','angular.filter', 'app.controllers',  'app.routes', 'app.services', 'app.directives','ngCordova','firebase','angular-md5', 'app.configs','app.util','app.auth','messages.module'])

.constant('FURL', 'https://snev.firebaseio.com/')
.run(function($ionicPlatform, $rootScope, $ionicLoading, $location, CONFIG ,$ionicPopup,$cordovaNetwork) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
   }
   
     $rootScope.$on('$cordovaNetwork:offline', function() {
			 $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "Connect your phone to mobile network or wireless internet connection"
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
								}
							});
		});

      
    	if (window.cordova) {
		
		cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
			if(!enabled){
		 $ionicPopup.confirm({
                        title: "Enable GPS",
                        content: "Click ok for change gps settings"
                    })
                    .then(function(result) {
                        if(result) {
                            cordova.plugins.diagnostic.switchToLocationSettings();
								}
							});
				}
			}, function(error){
				console.error("The following error occurred: "+error);
			});
	
	}
	
  });

});


