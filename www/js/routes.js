angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


 .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
		controller: 'homeController'
      }
    }
  })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'loginController'
        }
      }
    })
	
    .state('app.forgot', {
      url: '/forgot',
	   views: {
        'menuContent': {
		templateUrl: 'templates/forgot.html',
		controller:'forgotController'
        }
      }
    })
    .state('app.register', {
      url: '/register',
	  views: {
        'menuContent': {
         templateUrl: 'templates/register.html',
		controller:'registerController'
        }
      }
    })
 

  .state('app.signup', {
    url: '/signup',
	 views: {
        'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
        }
      }
  })

  .state('app.map', {
    url: '/map',
	 views: {
        'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
        }
      }
  })
   .state('app.addStation', {
    url: '/addStation',
	views: {
        'menuContent': {
        templateUrl: 'templates/add_station.html',
        controller: 'StationCtrl'
        }
      }
            })

  .state('app.stationDetail', {
    url: '/stationDetail',
	views: {
        'menuContent': {
       templateUrl: 'templates/stationDetail.html',
       controller: 'stationDetailCtrl'
        }
      }
  })
  
  .state('app.stationDirection', {
    url: '/stationDirection',
	views: {
        'menuContent': {
     templateUrl: 'templates/stationDirection.html',
    controller: 'stationDirectionCtrl'
        }
      }
  })
  
     .state('app.stationStatus', {
    url: '/stationStatus',
	views: {
        'menuContent': {
    templateUrl: 'templates/allStatus.html',
    controller: 'stationStatusCtrl'
        }
      }
  })

  .state('app.socialNetwork', {
    url: '/socialnetwork',
	views: {
        'menuContent': {
    templateUrl: 'templates/socialNetwork.html',
        }
      } 
  })

  .state('app.posthistory', {
    url: '/myposthistory',
	views: {
        'menuContent': {
    templateUrl: 'templates/postHistory.html',
        }
      }  
  })

  .state('app.messenger', {
    url: '/messenger',
	views: {
        'menuContent': {
    templateUrl: 'templates/messenger.html',
    controller: 'messengerCtrl'
        }
      }
  })

  .state('app.itemsForSale', {
    url: '/revenue',
	views: {
        'menuContent': {
    templateUrl: 'templates/itemsForSale.html',
    controller: 'itemsForSaleCtrl'
        }
      }
  })

  .state('app.adminHomepage', {
    url: '/adminhome',
	views: {
        'menuContent': {
    templateUrl: 'templates/adminHomepage.html',
    controller: 'adminHomepageCtrl'
        }
      }
  })

  .state('app.acceptNewStation', {
    url: '/adminacceptstation',
	views: {
        'menuContent': {
    templateUrl: 'templates/acceptNewStation.html',
    controller: 'acceptNewStationCtrl'
        }
      }
  })

  .state('app.acceptRevenue', {
    url: '/adminacceptrev',
	views: {
        'menuContent': {
    templateUrl: 'templates/acceptRevenue.html',
    controller: 'acceptRevenueCtrl'
        }
      }
  })

  .state('app.manageProfile', {
    url: '/myprofile',
	views: {
        'menuContent': {
    templateUrl: 'templates/manageProfile.html',
    controller: 'manageProfileCtrl'
        }
      }
  })



  .state('app.page', {
    url: '/page17',
	views: {
        'menuContent': {
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
        }
      }
  })

  .state('app.groupChat', {
    url: '/groupChat',
	views: {
        'menuContent': {
    templateUrl: 'templates/groupChat.html',
    //controller: 'RoomsCtrl'
        }
      }
  })

  .state('app.stationChat', {
    url: '/stationchat',
	views: {
        'menuContent': {
    templateUrl: 'templates/stationChat.html',
    controller: 'stationChatCtrl'
        }
      }
  })


  .state('app.posts', {
    url: '/posts',
	views: {
        'menuContent': {
    templateUrl: 'templates/posts.html',
    controller: 'postsCtrl'
        }
      }
  })

  .state('app.newPosts', {
    url: '/newPosts',
	views: {
        'menuContent': {
    templateUrl: 'templates/newPost.html',
        }
      }  
  })


  .state('app.chargingRecords', {
    url: '/chargingRecords',
	views: {
        'menuContent': {
    templateUrl: 'templates/chargingRecords.html',
    controller: 'chargingRecordsCtrl'
        }
      }
  })

//asanka profile

   .state('app.profile', {
      url: '/profile',
	  views: {
        'menuContent': {
      templateUrl: 'templates/profile.html',
      // controller:'loginController'
        }
      }
    })

     .state('app.profileEdit', {
      url: '/profileEdit',
	  views: {
        'menuContent': {
      templateUrl: 'templates/profileEdit.html',
      // controller:'loginController'
        }
      }
    })

  


  //asanka chat
  .state('app.rooms', {
      url: '/chatroomhome',
	  views: {
        'menuContent': {
      templateUrl: '/templates/home1.html',
        }
      }
    })
	
    .state('app.chatroomhome', {
      url: '/rooms',
	  views: {
        'menuContent': {
      templateUrl: '/templates/rooms.html',
      controller: 'RoomsListCtrl'
        }
      }
    })
	
    .state('app.room', {
      url: '/rooms/:roomId',
	  views: {
        'menuContent': {
      templateUrl: '/templates/room.html',
      controller: 'RoomDetailCtrl'
        }
      }
    })

    .state('app.viewpost', {
      url: '/viewpost',
	  views: {
        'menuContent': {
      templateUrl: 'templates/viewpost.html',
        }
      }
})

.state('app.friendslist', {
    url: '/friendslist',
	views: {
        'menuContent': {
		templateUrl: 'templates/friendslist.html',
        }
      }
  })

  .state('app.friendProfile', {
    url: '/friendProfile',
	views: {
        'menuContent': {
      templateUrl: 'templates/friendsProfile.html',
        }
      }
  })

  


    // setup an abstract state for the tabs directive

    // Each tab has its own nav history stack:


    /*---------------ADMIN------------------------*/
  // .state('adminHomepage', {
  //   url: '/adminhome',
  //   templateUrl: 'templates/adminHomepage.html',
  //   controller: 'adminHomepageCtrl'
  // })

  //admin user view
  .state('app.adminUserView', {
    url: '/userRecords',
	views: {
        'menuContent': {
    templateUrl: 'templates/adminUserView.html',
    controller: 'adminUserRecordsCtrl'
        }
      }
  })

  //admin station view
  .state('app.adminStationView', {
    url: '/stationRecords',
	views: {
        'menuContent': {
    templateUrl: 'templates/adminStationView.html',
    controller: 'adminStationRecordsCtrl'
        }
      }
  })

//make appointment
  .state('app.makeAppointment', {
	url: '/makeAppointment',
	views: {
        'menuContent': {
	templateUrl: 'templates/makeAppointment.html',
	controller: 'makeAppointmentCtrl'
        }
      }
  })


 //admin make new notices
  .state('app.newsPage', {
    url: '/newspage',
	views: {
        'menuContent': {
    templateUrl: 'templates/newsPage.html',
    controller: 'newsPageCtrl'
        }
      }
  })

  //User view notices
  .state('app.viewNewsPage', {
    url: '/viewnewspage',
	views: {
        'menuContent': {
     templateUrl: 'templates/viewNewsPage.html',
    controller: 'viewNewsPageCtrl'
        }
      }
  })
  
  

	 .state('app.editpost', {
          url: '/editpost',
		  views: {
        'menuContent': {
			templateUrl: '/templates/editpost.html'
          //controller: 'RoomDetailCtrl'
        }
      }
        })


  //
 //shopping list start here branna....................................................................................................
  .state('app.vehiclepart', {
    url: '/vehiclepart',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehicleParts.html',
        controller: 'vehiclepartsController'
      }
    } 
  })

  .state('app.vehiclepartNew', {
    url: '/vehiclepartNew/:part',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehiclePartsNew.html',
        controller: 'vehiclepartsControllerNew',
        controllerAs: 'ctrl'
      }
    } 
  })



$urlRouterProvider.otherwise('/app/login')



});
