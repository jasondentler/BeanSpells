angular.module('starter.services', [])
  .factory('Spells', function ($q, $http) {
    // Load the default spellbook from a JSON file

    var spells = [{ name: 'name', desc: 'description', id: 0 }];
    var isLoaded = false;

    var loadSpells = function () {
      if (isLoaded) return $q.when(spells);

      var defaultLocation = 'http://jasondentler.com/initial.beanspells.json';

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
          console.log({'RegExp': regExp});
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
  })
  .factory('Scroller', function ($ionicPosition, $ionicScrollDelegate, $timeout) {
    function findScrollParent(element) {
      if (!element) return null;
      var jqElement = angular.element(element);

      var parents = jqElement.parent();
      if (!parents || !parents.length) {
        console.log('No parent for element');
        return null;
      }

      if (parents.hasClass('scroll-content')) {
        console.log('Found parent with .scroll-content');
        return parents[0];
      }

      console.log('Traversing up the tree');
      var parent = findScrollParent(parents[0]);
      console.log({ 'Found': parent });
      return parent;
    }

    function findElementById(elementId) {
      console.log('document.getElementById(\'' + elementId + '\');')
      var element = document.getElementById(elementId);
      console.log({ 'Found': element });
      return element;
    }

    function getScrollDelegateHandle(element) {
      const delegateHandleAttrName = 'delegate-handle';

      if (!element) {
        console.log('No element passed in to findScrollDelegateHandle');
        return null;
      }

      var delegateHandle = angular.element(element).attr(delegateHandleAttrName);
      if (!delegateHandle) {
        console.log('Couldn\'t find delegate handle attribute on element');
        return null;
      }
      return $ionicScrollDelegate.$getByHandle(delegateHandle);
    }

    var scroller = {
      scrollTo: function (elementId) {
        console.log('Scrolling to ' + elementId);

        var element = findElementById(elementId);
        if (!element) {
          console.log('Couldn\'t find element ' + elementId);
          return;
        }

        var parent = findScrollParent(element);
        if (!parent) {
          console.log('Couldn\'t find parent');
          return;
        }

        var scrollDelegate = getScrollDelegateHandle(parent);
        if (!scrollDelegate) {
          console.log('Couldn\'t find scrollDelegate for element');
          return;
        }

        var position = $ionicPosition.position(angular.element(element));
        if (!position) {
          console.log('Couldn\'t find position for element');
          return;
        } else {
          console.log(position);
        }

        $timeout(function () {scrollDelegate.scrollTo(0, position.top, true);}, 0);
      }
    }
    return scroller;
  })
  .factory('Settings', function ($q, $http, Spells) {
    var Settings = { spellUrl: '' };
    Settings.updateSpellUrl = function (url) {
      if (url === Settings.spellUrl) return $q.when(url);

      return $http.get(url).then(function (response) {
        var x = {};
        x[url] = response.data;
        console.log(x);

        Settings.spellUrl = url;
        Spells.updateSpells(response.data);
        return url;
      });
    }
    return Settings;
  });