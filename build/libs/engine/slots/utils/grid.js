"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const cloner_1 = require("./cloner");
class Grid {
    static FirstStopFromStops(grid) {
        const stops = [];
        grid.forEach((reel, index) => {
            stops[index] = reel[0];
        });
        return stops;
    }
    static LastStopFromStops(grid) {
        const stops = [];
        grid.forEach((reel, index) => {
            stops[index] = reel[reel.length - 1];
        });
        return stops;
    }
    static MarkOffsets(grid, offsets) {
        offsets.forEach(offset => {
            const col = offset % grid.length;
            const row = Math.floor(offset / grid.length);
            grid[col][row] = -1;
        });
    }
    static MoveMarkedOffsetsDown(grid) {
        const newgrid = [[]];
        for (let col = 0; col < grid.length; col++) {
            newgrid[col] = [];
            for (let row = 0; row < grid[col].length; row++) {
                if (grid[col][row] === -1) {
                    newgrid[col].push(grid[col][row]);
                }
            }
        }
        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
                if (grid[col][row] !== -1) {
                    newgrid[col].push(grid[col][row]);
                }
            }
        }
        return newgrid;
    }
    static FindScatterOffsets(symbol, grid) {
        const offsets = [];
        for (let reel = 0; reel < grid.length; reel++) {
            for (let row = 0; row < grid[reel].length; row++) {
                if (grid[reel][row] == symbol) {
                    offsets.push(grid.length * row + reel);
                }
            }
        }
        return offsets;
    }
    static FindScatterOffsetsInReels(symbol, reels, grid) {
        const offsets = [];
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            for (let row = 0; row < grid[reel].length; row++) {
                if (grid[reel][row] == symbol) {
                    offsets.push(grid.length * row + reel);
                }
            }
        }
        return offsets;
    }
    static ReplaceSymbolsInOffsets(offsets, grid, newSymbol) {
        const newgrid = cloner_1.Cloner.CloneGrid(grid);
        offsets.forEach(offset => {
            const col = offset % grid.length;
            const row = Math.floor(offset / grid.length);
            newgrid[col][row] = newSymbol;
        });
        return newgrid;
    }
    static UpdateSymbolsInOffsetsWithPrevGrid(offsets, grid, prevGrid) {
        const newgrid = cloner_1.Cloner.CloneGrid(grid);
        offsets.forEach(offset => {
            const col = offset % grid.length;
            const row = Math.floor(offset / grid.length);
            newgrid[col][row] = prevGrid[col][row];
        });
        return newgrid;
    }
    static ReplaceSymbolsInGrid(symbols, grid, newSymbol) {
        const newgrid = [[]];
        for (let reel = 0; reel < grid.length; reel++) {
            newgrid[reel] = [];
            for (let row = 0; row < grid[reel].length; row++) {
                if (symbols.includes(grid[reel][row])) {
                    newgrid[reel][row] = newSymbol;
                }
                else {
                    newgrid[reel][row] = grid[reel][row];
                }
            }
        }
        return newgrid;
    }
}
exports.Grid = Grid;
