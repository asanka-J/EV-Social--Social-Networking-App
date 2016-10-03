angular.module('messages.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  
    .state('app.UserMessages', {
    url: '/UserMessages',
	views: {
        'menuContent': {
    templateUrl: 'templates/UserMessages.html',
    controller: 'UserMessagesCtrl'
        }
      }
  })

});
