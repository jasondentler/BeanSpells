angular.module('starter.controllers')
  .controller('SpellsCtrl', function ($scope, Spells, Scroller, DiceNotation) {
    console.log('Spells controller');

    $scope.filters = {};

    var filters = {
      class: null,
      level: null,
      search: null
    };

    function generateDiceNotationLink(notation) {
      //return ' <a href="#/tab/roll">' + notation.notation + '</a> '
      return ' <a href="#/tab/roll/' + notation.count + '/' + notation.sides + '/' + notation.modifier + '">' + notation.notation + '</a> '
    }

    function parseDiceNotationFromHtml(html) {
      html = html || '';
      var notations = DiceNotation.parse(html) || [];

      var offset = 0;
      for (var i = 0; i < notations.length; i++) {
        var notation = notations[i];

        var previousLength = html.length;
        var startIndex = notation.charIndex + offset;
        var endIndex = startIndex + (notation.matchedText || '').length;

        var link = generateDiceNotationLink(notation);
        html = html.slice(0, startIndex) + link + html.slice(endIndex);

        //update the offset using the new length
        offset = offset + (html.length - previousLength);
      }

      return html;
    }

    function parseDiceNotation(spell) {
      if (!!spell.parsedDiceNotations) return;
      spell.desc = parseDiceNotationFromHtml(spell.desc);
      spell.higher_level = parseDiceNotationFromHtml(spell.higher_level);
      spell.parsedDiceNotations = true;
    }

    function bindSpells() {
      console.log('Binding spells');

      var filterArray = [];

      if (!!filters.class) filterArray.push(filters.class);
      if (!!filters.level) filterArray.push(filters.level);
      if (!!filters.search) filterArray.push(filters.search);

      Spells.find(filterArray).then(function (spells) {
        parseDiceNotation(spells);
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

    $scope.onSearchFilterChange = function (searchString) {
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
      parseDiceNotation(spell);
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
  });