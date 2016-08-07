angular.module('starter.services')
    .factory('DiceRoller', function () {
        // Stores the results of a roll
        function Result(rolls, modifier) {
            var self = this;
            self.rolls = rolls || [];
            self.modifier = modifier || 0;
            self.recalculate = function () {
                self.total = self.rolls.reduce(function (previousValue, currentValue) {
                    return { index: 0, value: previousValue.value + currentValue.value };
                }).value + modifier;
            };
            self.recalculate();
        }

        // Returns a random integer between min (included) and max (included)
        // Using Math.round() will give you a non-uniform distribution!
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var whitespacePattern = /\s/gmi

        var cleanUpInt = function (intishString, defaultValue) {
            if (intishString === null || typeof intishString === 'undefinted') return defaultValue;
            if (typeof intishString == 'number') return intishString;
            intishString = intishString || '';
            intishString = intishString.replace(whitespacePattern, '');
            var int = parseInt(intishString, 10);
            if (isNaN(int)) return defaultValue;
            return int;
        }

        var roll = function (diceCount, diceSides, modifier) {
            diceCount = cleanUpInt(diceCount, 1);
            diceSides = cleanUpInt(diceSides, 20);
            modifier = cleanUpInt(modifier, 0);

            var rolls = [];
            for (var rollCount = 0; rollCount < diceCount; rollCount++)
                rolls.push({ index: rollCount, sides: diceSides, value: getRandomIntInclusive(1, diceSides) });

            return new Result(rolls, modifier);
        }

        var reroll = function (result, index) {
            var toReroll = result.rolls[index];
            var newValue = getRandomIntInclusive(1, toReroll.sides);
            toReroll.value = newValue;
            result.recalculate();
            return result;
        }

        return {
            roll: roll,
            reroll: reroll,
            clean: cleanUpInt
        };
    });