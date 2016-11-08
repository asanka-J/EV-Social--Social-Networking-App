angular.module('messages.controllers', [ 'ionic',"firebase",'app','angularMoment','messages.elastic'])


.controller('UserMessagesCtrl', ['$scope', '$rootScope', '$state',
  '$stateParams', 'MockService', '$ionicActionSheet',
  '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval',
  function($scope, $rootScope, $state, $stateParams, MockService,
    $ionicActionSheet,
    $ionicPopup, $ionicScrollDelegate,$timeout, $interval,$localStorage, $firebaseArray) {




      $scope.chatkey=localStorage.chatKey;
      //alert($scope.chatkey);
    // mock acquiring data via $stateParams
    $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://ionicframework.com/img/docs/venkman.jpg',
      username:localStorage.sendTo,
    }
//alert(localStorage.fromUserKey);
    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
      _id: localStorage.fromUserKey,
      pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
      username:localStorage.fromUser,
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
     
            
         var refChat=new Firebase('https: //snev.firebaseio.com/testchat/'+$scope.chatkey);
          
          
           var a=[];
           
      
              refChat.once('value', function(snapshot) {
                   // console.log(snapshot.val());
                    snapshot.forEach(function(vote) {
                    
                    a.push(vote.val());
                     
                    });
                  
                })
                  
                  $scope.messages=a;


              refChat.orderByChild("_id")
                .limitToLast(1)
                .on("child_added", function(dsnapshot) {
                    var message = dsnapshot.val();
               $scope.messages.push(message);
                })
                
               

    
      
      $timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);

      messageCheckTimer = $interval(function() {

        viewScroll.scrollBottom(true);
             refChat.child("typingStat").child(localStorage.sendTo).on("child_changed", function(chatsnapshot) {
                    var chatt = chatsnapshot.val();
                    $scope.chatStat=chatt;
                   
                })

      }, 100);
    });

    $scope.$on('$ionicView.leave', function() {
      
    
      // Make sure that the interval is destroyed
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
        $scope.input.message="";
      }
    });
    

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.toUser._id);

      }
    });

  

    $scope.$watch('input.message', function(newValue, oldValue) {
           var refChatstat=new Firebase('https: //snev.firebaseio.com/testchat/'+$scope.chatkey);
      if (!newValue) newValue = '';
         localStorage['userMessage-' + $scope.toUser._id] = newValue;

	    refChatstat.child("typingStat").child(localStorage.fromUser).set({typing:newValue});
      
	  
    });

  
  
    $scope.sendMessage = function(sendMessageForm) {


      var message = {
        toId: $scope.toUser._id,
        text: $scope.input.message
      };

      keepKeyboardOpen();
      

      var refChat=new Firebase('https: //snev.firebaseio.com/testchat/'+$scope.chatkey);
    
      $scope.input.message = '';

      message._id = new Date().getTime(); // :~)
     message.date = new Date().getTime();	
      message.sender = $scope.user.username;
      message.reciever = $scope.toUser.username;
      message.userId = $scope.user._id;
    //  message.pic = $scope.user.picture;
	  message.pic = "https://blog.madmimi.com/wp-content/uploads/2014/06/gary_gravatar.png";

    //  $scope.messages.push(message);
	     refChat.push(message).then($scope.input.message="");
       
	     
      $timeout(function() {
        keepKeyboardOpen();
        viewScroll.scrollBottom(true);
      }, 0);

      $timeout(function() {
      //  $scope.messages.push(MockService.getMockMessage());
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
              //**************DELETE MESSAGE *************************************
              
              // var redDelete=new Firebase('https: //snev.firebaseio.com/testchat');
              //    redDelete.orderByChild("message").equalTo(message).on("child_added", function(snapshot) {
					    //       var value=snapshot.key();
              //       alert(value);
              // })
              //******************************************************************

              $timeout(function() {
                viewScroll.resize();
              }, 0);

              break;
          }
          
          return true;
        }
      });
    };


    	var addMessage = function (message) {

        alert("image selected");
			message._id = new Date().getTime(); // :~)
			message.date = new Date();
			message.username = $scope.user.username;
			message.userId = $scope.user._id;
			message.pic = $scope.user.picture;
			$scope.messages.push(message);
		};

var lastPhoto = 'img/donut.png';

		$scope.sendPhoto = function () {
			$ionicActionSheet.show({
				buttons: [
					{ text: 'Take Photo' },
					{ text: 'Photo from Library' }
				],
				titleText: 'Upload image',
				cancelText: 'Cancel',
				buttonClicked: function (index) {
					
					var message = {
						toId: $scope.toUser._id,
						photo: lastPhoto
					};
					lastPhoto = lastPhoto === 'img/donut.png' ? 'img/woho.png' : 'img/donut.png';
					alert(lastPhoto);
          
          addMessage(message);

					$timeout(function () {
					//	var message = MockService.getMockMessage();
				//		message.date = new Date();
					//	$scope.messages.push(message);
					}, 2000);
					return true;
				}
			});
		};


    
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
     // 	deferred.resolve(getMockMessages());
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
