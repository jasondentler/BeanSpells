angular.module('starter.controllers')
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
  });