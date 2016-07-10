angular.module('starter.controllers', [])
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
  });