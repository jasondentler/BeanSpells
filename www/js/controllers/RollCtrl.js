angular.module('starter.controllers')
  .controller('RollCtrl', function ($scope, $stateParams, DiceRoller) {
    console.log('Roll controller');
    console.log($stateParams);

    $scope.count = DiceRoller.clean($stateParams.count, 1);
    $scope.sides = DiceRoller.clean($stateParams.sides, 20);
    $scope.modifier = DiceRoller.clean($stateParams.modifier, 0);

    $scope.abs = Math.abs;
    
    var roll = function (count, sides, modifier) {
      count = DiceRoller.clean(count, 1);
      sides = DiceRoller.clean(sides, 20);
      modifier = DiceRoller.clean(modifier, 0);
      $scope.count = count;
      $scope.sides = sides;
      $scope.modifier = modifier;
      var result = DiceRoller.roll(count, sides, modifier);
      $scope.result = result;
    }

    $scope.roll = roll;

    var reroll = function (result, rollIndex) {
      $scope.result = DiceRoller.reroll(result, rollIndex);
    }

    $scope.reroll = reroll;

    roll($scope.count, $scope.sides, $scope.modifier);
  });