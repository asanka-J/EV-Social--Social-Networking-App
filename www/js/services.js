(function() {
  'use strict';

  angular
    .module('app.services', [])
 function VechileFactory($firebaseArray,$q) {
      var ref = new Firebase('https://snev.firebaseio.com/');
      var parts = [];

      return {
        getVechilePartTypes: function() {
          var defer = $q.defer();
          ref.child('vechile_parts').on("value", function(snapshot) {
            defer.resolve(snapshot.val());
          });
          return defer.promise;
          //return $firebaseArray(ref.child('vechile_parts'));
        },
        getVechileParts: function(type) {
          return $firebaseArray(ref.orderByChild('vechile_parts').child(type));
        },
        addVechileParts: function(part, type) {
          ref.child('vechile_parts').child(type).push().set(part);
          //return $firebaseArray(ref.child('vechile_parts').child(type));
        },
        addParts: function(part) {
          parts.push(part);
        },
        removeParts: function(index) {
          parts.splice(index, 1);
        },
        getParts: function() {
          return parts;
        }
      }
    }

    function RoomFactory($firebaseArray) {
        var ref = new Firebase('https://snev.firebaseio.com/');
        var rooms = $firebaseArray(ref.child('rooms'));
        var messages = $firebaseArray(ref.child('messages'));
        var username1=window.localStorage.getItem("user");

        return {
          allRooms: rooms,
          room: function(roomId) {
            return rooms.$getRecord(roomId);
          },

          messages: function(roomId) {
            return $firebaseArray(ref.child('messages').orderByChild('roomId').equalTo(roomId));
          },

          send: function(newMessage, roomId) {
            return messages.$add({


              username: username1,
              content: newMessage,
              sentAt: Firebase.ServerValue.TIMESTAMP,
              roomId: roomId
            });
          },







        }
      }

      angular
        .module('app')
        .factory('RoomFactory', ['$firebaseArray', RoomFactory])
  .factory('VechileFactory', ['$firebaseArray','$q', VechileFactory])



})();
