angular.module('messages.controllers', [ 'ionic',"firebase",'app','angularMoment','messages.elastic'])


.controller('UserMessagesCtrl', ['$scope', '$rootScope', '$state',
  '$stateParams', 'MockService', '$ionicActionSheet',
  '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval',
  function($scope, $rootScope, $state, $stateParams, MockService,
    $ionicActionSheet,
    $ionicPopup, $ionicScrollDelegate, $timeout, $interval,$localStorage, $firebaseArray) {

	var refChat=new Firebase('https://snev.firebaseio.com/privateChat');
	
  


    // mock acquiring data via $stateParams
    $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://ionicframework.com/img/docs/venkman.jpg',
      username:localStorage.fromUser,
    }

    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
      _id: '534b8fb2aa5e7afc1b23e69c',
      pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
      username:localStorage.sendTo,
    };

    $scope.input = {
      message: localStorage['userMessage-' + $scope.toUser._id] || ''
    };

    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function() {
      
    
      getMessages();
      getMessages();
      
      $timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);

      messageCheckTimer = $interval(function() {
        // here you could check for new messages if your app doesn't use push notifications or user disabled them
      }, 20000);
    });

    $scope.$on('$ionicView.leave', function() {
      
      // Make sure that the interval is destroyed
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
      }
    });
    

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.toUser._id);
       // alert("leaving");
      }
    });

    function getMessages() {
      // the service is mock but you would probably pass the toUser's GUID here
      MockService.getUserMessages({
        toUserId: $scope.toUser._id
		
      }).then(function(data) {
        $scope.doneLoading = true;
        $scope.messages = data.messages;
		//console.log("getting messages function"+data.messages);
	//xxxx	
			
		
			/*refChat.orderByChild("id").on("child_added", function(snapshot) {
			  console.log(snapshot.key() + " was " + snapshot.val()._id + " meters tall");
			  $scope.messages= snapshot.val();
			});
			*/
	//push
		  
		
	
		
	
        $timeout(function() {
          viewScroll.scrollBottom();
        }, 0);
      });
    }

    $scope.$watch('input.message', function(newValue, oldValue) {
   
      if (!newValue) newValue = '';
         localStorage['userMessage-' + $scope.toUser._id] = newValue;
    });

    $scope.sendMessage = function(sendMessageForm) {




      var message = {
        toId: $scope.toUser._id,
        text: $scope.input.message
      };

      // if you do a web service call this will be needed as well as before the viewScroll calls
      // you can't see the effect of this in the browser it needs to be used on a real device
      // for some reason the one time blur event is not firing in the browser but does on devices
      keepKeyboardOpen();
      
      //MockService.sendMessage(message).then(function(data) {
      $scope.input.message = '';

      message._id = new Date().getTime(); // :~)
      message.date = new Date();
      message.sender = $scope.user.username;
      message.reciever = $scope.user.username;
      message.userId = $scope.user._id;
      //message.pic = $scope.user.picture;
	  message.pic = "https://blog.madmimi.com/wp-content/uploads/2014/06/gary_gravatar.png";

      $scope.messages.push(message);
	     refChat.push(message);
	  



  
	  
      $timeout(function() {
        keepKeyboardOpen();
        viewScroll.scrollBottom(true);
      }, 0);

      $timeout(function() {
        $scope.messages.push(MockService.getMockMessage());
        keepKeyboardOpen();
        viewScroll.scrollBottom(true);
      }, 2000);

      //});
    };
    
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
      
      txtInput.one('blur', function() {
       
        txtInput[0].focus();
      });
    }

    $scope.onMessageHold = function(e, itemIndex, message) {
      
      
      $ionicActionSheet.show({
        buttons: [{
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              //cordova.plugins.clipboard.copy(message.text);

              break;
            case 1: // Delete
              // no server side secrets here :~)
              $scope.messages.splice(itemIndex, 1);
              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function(msg) {
      if (msg.userId === $scope.user._id) {
        // go to your profile
      } else {
        // go to other users profile
      }
    };
    
    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('taResize', function(e, ta) {
      
      if (!ta) return;
      
      var taHeight = ta[0].offsetHeight;
      
      
      if (!footerBar) return;
      
      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
      
      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px'; 
    });

}])

// services
.factory('MockService', ['$http', '$q',
  function($http, $q) {
    var me = {};

    me.getUserMessages = function(d) {
    
      var deferred = $q.defer();
      
		 setTimeout(function() {
      	deferred.resolve(getMockMessages());
	    }, 1500);
      
      return deferred.promise;
    };

    me.getMockMessage = function() {
      return {
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: ' Test reply'
      };
    }

    return me;
  }
])

// fitlers
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])
/*
// directives
.directive('autolinker', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var eleHtml = element.html();

          if (eleHtml === '') {
            return false;
          }

          var text = Autolinker.link(eleHtml, {
            className: 'autolinker',
            newWindow: false
          });

          element.html(text);

          var autolinks = element[0].getElementsByClassName('autolinker');

          for (var i = 0; i < autolinks.length; i++) {
            angular.element(autolinks[i]).bind('click', function(e) {
              var href = e.target.href;
              

              if (href) {
                //window.open(href, '_system');
                window.open(href, '_blank');
              }

              e.preventDefault();
              return false;
            });
          }
        }, 0);
      }
    }
  }
])
*/
function onProfilePicError(ele) {
  this.ele.src = ''; // set a fallback
}

//xxxx
/*
function getMockMessages() {
	
  	var refChat=new Firebase('https://snev.firebaseio.com/privateChat');
	
	refChat.orderByChild("id").on("child_added", function(snapshot) {
			  var messages=snapshot.val();
      //  console.log(messages);
			 
			});

      var msg=$firebaseArray(refChat);
 console.log(msg);

  // return {"messages":[
  //                      { "_id":"535d625f898df4e80e2a125e",
  //                        "text":"Ionic has changed the game for hybrid app development.",
  //                        "userId":"534b8fb2aa5e7afc1b23e69c",
  //                        "date":"2014-04-27T20:02:39.082Z",
  //                        "read":true,
  //                        "readDate":"2016-10-01T06:27:37.944Z"}   ,

  // {"_id":"54781ca4ab43d1d4113abff1","text":"chat test 2","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"}],"unread":0};

			return messages;
}
*/




function getMockMessages() {
	
  
  return {"messages":[{"_id":"535d625f898df4e80e2a125e","text":"Ionic has changed the game for hybrid app development.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-04-27T20:02:39.082Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"chat test 2","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"}],"unread":0};
}



// // configure moment relative time
// moment.locale('en', {
//   relativeTime: {
//     future: "in %s",
//     past: "%s ago",
//     s: "%d sec",
//     m: "a minute",
//     mm: "%d minutes",
//     h: "an hour",
//     hh: "%d hours",
//     d: "a day",
//     dd: "%d days",
//     M: "a month",
//     MM: "%d months",
//     y: "a year",
//     yy: "%d years"
//   }
// });

  