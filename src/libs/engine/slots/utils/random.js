"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomHelper = void 0;
var Random_1 = require("../../generic/rng/Random");
var RandomHelper = /** @class */ (function () {
    function RandomHelper() {
    }
    RandomHelper.GetRandomFromList = function (rng, list) {
        if (list.length == 1)
            return list[0];
        var totalWeight = 0;
        list.forEach(function (item) {
            totalWeight += item.weight;
        });
        var random = rng.getRandom(new Random_1.RandomObj(0, totalWeight, -1));
        return this.GetObjectFromList(random.num, list);
    };
    RandomHelper.GetObjectFromList = function (randomNumber, list) {
        if (list.length == 1)
            return list[0];
        var weightSum = 0;
        for (var i = 0; i < list.length; i++) {
            weightSum += list[i].weight;
            if (randomNumber < weightSum)
                return list[i];
        }
        return null;
    };
    return RandomHelper;
}());
exports.RandomHelper = RandomHelper;
