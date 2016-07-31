angular.module('starter.controllers', [])
  .controller('SpellsCtrl', function ($scope, Spells, Scroller) {
    console.log('Spells controller')
    $scope.filters = {};
    
    var filters = {
      class: null,
      level: null,
      search: null
    };

    function bindSpells() {
      console.log('Binding spells');

      var filterArray = [];

      if (!!filters.class) filterArray.push(filters.class);
      if (!!filters.level) filterArray.push(filters.level);
      if (!!filters.search) filterArray.push(filters.search);

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

    $scope.onSearchFilterChange = function(searchString) {
      if (!!searchString && searchString.length && searchString.trim().length) {
        filters.search = Spells.filters.search(searchString);
      } else {
        filters.search = null;
      }
      bindSpells();
    }

    $scope.isExpanded = function (spell) {
      return spell === $scope.selectedSpell;
    }

    $scope.toggleView = function (spell) {
      console.log({ 'Toggling view of': spell });

      var selectedSpell = $scope.selectedSpell;

      if (selectedSpell == spell) {
        // Unselect the spell
        console.log({ 'Toggle off spell': spell.name });
        $scope.selectedSpell = null;
        return;
      }

      console.log({ 'Toggle to spell': spell });
      $scope.selectedSpell = spell;
      setTimeout(function () { Scroller.scrollTo('spell-' + spell.id); }, 0);
    }

    Spells.classes().then(function (classes) {
      $scope.classes = classes;
    })

    Spells.levels().then(function (levels) {
      $scope.levels = levels;
    })

    $scope.selectedSpell = null;
    bindSpells(filters);
  })

  .controller('SettingsCtrl', function ($scope, Settings, $ionicPopup, $rootScope) {
    console.log('Settings controller');

    $scope.updatingSpells = false;
    if (!!$rootScope && !!$rootScope.spellUrl)
      $scope.spellUrlTextValue = $rootScope.spellUrl;

    $scope.updateSpellUrl = function (url) {
      console.log({ 'Updating spell url to': url });

      $scope.updatingSpells = true;

      Settings.updateSpellUrl(url).then(function (url) {
        console.log('Done updating spells');
      })
        .catch(function (response) {
          console.error({ response: response });
          $ionicPopup.alert({
            title: 'Download failed',
            template: 'Response: ' + response.statusText
          });
        })
        .finally(function () {
          $scope.updatingSpells = false;
        })
    }
  })