angular.module('starter.services')
    .factory('DiceNotation', function () {

        var pattern = /\s*(\d*)[dD](\d+)\s*\+?(\s*-?\s*\d+)?\s*/gmi;
        var whitespacePattern = /\s/gmi

        var cleanUpInt = function (intishString, defaultValue) {
            if (typeof intishString == 'Number') return intishString;
            intishString = intishString || '';
            intishString = intishString.replace(whitespacePattern, '');
            var int = parseInt(intishString, 10);
            if (isNaN(int)) return defaultValue;
            return int;
        }

        var parse = function (text) {
            var patternResult;
            var matches = [];
            while ((patternResult = pattern.exec(text)) !== null) {
                var matchedNotation = (patternResult[0] || '').replace(whitespacePattern, '');
                var matchedDiceCount = cleanUpInt(patternResult[1], 1);
                var matchedDiceSides = cleanUpInt(patternResult[2], 20);
                var matchedModifier = cleanUpInt(patternResult[3], 0);
                var match = {
                    'matchedText': patternResult[0],
                    'notation': matchedNotation,
                    'count': matchedDiceCount,
                    'sides': matchedDiceSides,
                    'modifier': matchedModifier,
                    'charIndex': patternResult.index,
                    'pattern results': patternResult
                };
                matches.push(match);
            }
            console.log(matches);
            return matches;
        }

        return {
            parse: parse
        };

    });