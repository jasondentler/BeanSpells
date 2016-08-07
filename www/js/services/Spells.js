angular.module('starter.services')
  .factory('Spells', function ($q, $http) {
    // Load the default spellbook from a JSON file

    var spells = [{ name: 'name', desc: 'description', id: 0 }];
    var isLoaded = false;

    var loadSpells = function () {
      if (isLoaded) return $q.when(spells);

      var defaultLocation = 'http://jasondentler.com/srd.spelldata.json';

      return $http.get(defaultLocation)
        .then(function (response) {
          return parseSpells(response.data);
        });
    };

    var parseSpells = function (spellData) {
      if (typeof spellData === 'undefined' || spellData === null) return spells;

      spells = spellData;
      isLoaded = true;

      for (var i = 0; i < spells.length; i++) {
        var spell = spells[i];
        spell.id = i;
        var calculatedLevel = !!spell.level ? parseInt(spell.level.charAt(0), 10) : 0;
        spell.calculatedLevel = isNaN(calculatedLevel) ? 0 : calculatedLevel;
      }

      console.log({ 'spells': spells });
      return spells;
    }

    loadSpells();

    return {
      updateSpells: function (spellData) {
        parseSpells(spellData);
      },
      classes: function () {
        return loadSpells().then(function (spells) {
          var x = spells
            .map(function (spell) { return spell.class; })
            .map(function (classNames) { return classNames.split(","); }) // array of arrays
            .selectMany()
            .map(function (className) { return className.trim(); })
            .distinct()
            .sort();
          return x;
        })
      },
      levels: function () {
        return loadSpells().then(function (spells) {
          var levels = spells
            .map(function (spell) { return spell.calculatedLevel; })
            .distinct()
            .sort()
            .map(function (level) {
              if (level === 0) return { name: 'Cantrip', value: 0 };
              return { name: 'Level ' + level, value: level };
            })
          console.log(levels);
          return levels;
        })
      },
      all: function () {
        return loadSpells();
      },
      filters: {
        byClass: function (className) {
          console.log({ 'Creating filter on class': className });
          return function (item) {
            return !!item.class && item.class.includes(className);
          }
        },
        byLevel: function (level) {
          console.log({ 'Creating filter on level': level });
          var calculatedLevel = parseInt(level, 10);
          return function (item) {
            return item.calculatedLevel <= calculatedLevel;
          }
        },
        search: function (searchString) {
          var regExp = new RegExp(searchString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
          console.log({ 'Creating filter on search string': searchString });
          console.log({ 'RegExp': regExp });
          return function (item) {
            return regExp.test(item.name || '') ||
              regExp.test(item.desc || '') ||
              regExp.test(item.higher_level || '') ||
              regExp.test(item.material || '');
          }
        }
      },
      find: function (filters) {
        return loadSpells().then(function (spells) {

          if (filters == null) return spells;

          if (typeof filters === "function") {
            filters = [filters];
          }
          else if (!Array.isArray(filters)) {
            throw "find parameter should be a function or an array of functions";
          }

          var results = spells;
          for (var i = 0; i < filters.length; i++) {
            if (typeof filters[i] !== "function") {
              throw "Filter at index " + i + " is " + typeof filters[i] + ", not a function";
            }
            results = results.filter(filters[i]);
          }
          return results;
        })
      },
      get: function (idx) {
        return loadSpells().then(function (spells) {
          if (idx < 0) return null;
          if (idx >= spells.length) return null;
          return spells[idx];
        });
      }
    }
  });