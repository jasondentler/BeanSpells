angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) { })

  .controller('SpellsCtrl', function ($scope, Spells) {
    $scope.filters = {};

    var filters = {
      class: null
    };

    function bindSpells() {
      var filterArray = [];

      if (!!filters.class) filterArray.push(filters.class);

      Spells.find(filterArray).then(function (spells) {
        $scope.spells = spells;
      })
    }

    $scope.onClassFilterChange = function (className) {
      if (!!className) {
        $scope.filters.className = className;
        filters.class = Spells.filters.byClass(className);
      } else {
        $scope.filters.className = null;
        filters.class = null;
      }
      bindSpells();
    }

    Spells.classes().then(function (classes) {
      $scope.classes = classes;
    })

    bindSpells(filters);
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
