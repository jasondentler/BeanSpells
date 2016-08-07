angular.module('starter.services')
    .factory('DiceRoller', function () {
        // Stores the results of a roll
        function Result(rolls, modifier) {
            this.rolls = rolls || [];
            this.modifier = modifier || 0;
            this.total = rolls.reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
            }) + modifier;
        }

        // Returns a random integer between min (included) and max (included)
        // Using Math.round() will give you a non-uniform distribution!
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var roll = function roll(diceCount, diceSides, modifier) {
            diceCount = diceCount || 1;
            diceSides = diceSides || 6;
            modifier = modifier || 0;

            var rolls = [];
            for (var rollCount = 0; rollCount < diceCount; rollCount++)
                rolls.push(getRandomIntInclusive(1, diceSides));

            return new Result(rolls, modifier);
        }

        return {
            roll: roll
        };
    });