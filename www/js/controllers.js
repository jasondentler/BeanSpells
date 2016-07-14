angular.module('starter.controllers', [])
  .controller('SpellsCtrl', function ($scope, Spells) {
    console.log('Spells controller')
    $scope.filters = {};

    var filters = {
      class: null,
      level: null
    };

    function bindSpells() {
      console.log('Binding spells');

      var filterArray = [];

      if (!!filters.class) filterArray.push(filters.class);
      if (!!filters.level) filterArray.push(filters.level);

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

    $scope.onLevelFilterChange = function (level) {
      if (!!level) {
        $scope.filters.level = level;
        filters.level = Spells.filters.byLevel(level);
      } else {
        $scope.filters.level = null;
        filters.level = null;
      }
      bindSpells();
    }

    Spells.classes().then(function (classes) {
      $scope.classes = classes;
    })

    Spells.levels().then(function (levels) {
      $scope.levels = levels;
    })

    bindSpells(filters);
  })
  .controller('SettingsCtrl', function($scope, Settings) {
    console.log('Settings controller');

    $scope.updateSpellUrl = function (url) {
      console.log({'Updating spell url to': url});

      $scope.updatingSpells = true;
      
      Settings.updateSpellUrl(url).then(function (url) {
        console.log('Done updating spells');
        $scope.updatingSpells = false;
      });
    }
  })