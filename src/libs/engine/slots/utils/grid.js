"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var Grid = /** @class */ (function () {
    function Grid() {
    }
    Grid.FirstStopFromStops = function (grid) {
        var stops = [];
        grid.forEach(function (reel, index) {
            stops[index] = reel[0];
        });
        return stops;
    };
    Grid.MarkOffsets = function (grid, offsets) {
        offsets.forEach(function (offset) {
            var col = offset % grid.length;
            var row = Math.floor(offset / grid.length);
            grid[col][row] = -1;
        });
    };
    Grid.MoveMarkedOffsetsDown = function (grid) {
        var newgrid = [[]];
        for (var col = 0; col < grid.length; col++) {
            newgrid[col] = [];
            for (var row = 0; row < grid[col].length; row++) {
                if (grid[col][row] === -1) {
                    newgrid[col].push(grid[col][row]);
                }
            }
        }
        for (var col = 0; col < grid.length; col++) {
            for (var row = 0; row < grid[col].length; row++) {
                if (grid[col][row] !== -1) {
                    newgrid[col].push(grid[col][row]);
                }
            }
        }
        return newgrid;
    };
    Grid.FindScatterOffsets = function (symbol, grid) {
        var offsets = [];
        for (var reel = 0; reel < grid.length; reel++) {
            for (var row = 0; row < grid[reel].length; row++) {
                if (grid[reel][row] == symbol) {
                    offsets.push(grid.length * row + reel);
                }
            }
        }
        return offsets;
    };
    return Grid;
}());
exports.Grid = Grid;
