angular.module('starter.services')
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