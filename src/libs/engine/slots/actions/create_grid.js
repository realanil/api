"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGrid = void 0;
var random_1 = require("../utils/random");
var CreateGrid = /** @class */ (function () {
    function CreateGrid() {
    }
    CreateGrid.StandardGrid = function (reelSet, stops) {
        var colLen = stops.length;
        var grid = [];
        for (var col = 0; col < colLen; col++) {
            grid[col] = [];
            for (var row = 0; row < stops[col].length; row++) {
                grid[col][row] = reelSet[col][stops[col][row]];
            }
        }
        return grid;
    };
    CreateGrid.WeightedSymbolGrid = function (rng, reelSet, layout) {
        var grid = [];
        layout.forEach(function (reel, index) {
            grid[index] = [];
            for (var i = 0; i < reel; i++) {
                var symbol = random_1.RandomHelper.GetRandomFromList(rng, reelSet);
                grid[index].push(symbol.symbol);
            }
        });
        return grid;
    };
    return CreateGrid;
}());
exports.CreateGrid = CreateGrid;
