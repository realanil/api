"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStops = void 0;
const random_1 = require("../../generic/rng/random");
const cloner_1 = require("../utils/cloner");
class CreateStops {
    static StandardStopsForNulls(initialStop, reelSet, grid) {
        const newStops = cloner_1.Cloner.CloneGrid(grid);
        for (let col = 0; col < newStops.length; col++) {
            const reelLength = reelSet[col].length;
            for (let row = 0; row < newStops[col].length; row++) {
                if (newStops[col][row] === -1) {
                    let stop = initialStop[col] - row - 1;
                    stop = (stop < 0) ? (reelLength + stop) : stop;
                    newStops[col][row] = stop;
                }
                else {
                    break;
                }
            }
        }
        return newStops;
    }
    static StandardReverseStopsForNulls(initialStop, reelSet, grid) {
        const newStops = cloner_1.Cloner.CloneGrid(grid);
        for (let col = 0; col < newStops.length; col++) {
            const reelLength = reelSet[col].length;
            for (let row = 0; row < newStops[col].length; row++) {
                if (newStops[col][row] === -1) {
                    let stop = initialStop[col] + row + 1;
                    stop = (stop < 0) ? (reelLength + stop) : stop;
                    newStops[col][row] = stop;
                }
            }
        }
        return newStops;
    }
    static StandardStopsFromStops(prestop, reelSet, layout) {
        const stops = [];
        for (let i = 0; i < prestop.length; i++) {
            const col = prestop[i];
            stops[col] = [];
            const reelLength = reelSet[col].length;
            for (let row = 0; row < layout[col]; row++) {
                let stop = prestop[i] + row;
                stop = (stop >= reelLength) ? (stop - reelLength) : stop;
                stops[col][row] = stop;
            }
        }
        return stops;
    }
    static StandardStops(rng, reelSet, layout) {
        const req = [];
        for (let r = 0; r < reelSet.length; r++) {
            req[r] = new random_1.RandomObj(0, reelSet[r].length, r);
        }
        const resp = rng.getRandoms(req);
        const stops = [];
        for (let i = 0; i < resp.length; i++) {
            const col = resp[i].index;
            stops[col] = [];
            const reelLength = reelSet[col].length;
            for (let row = 0; row < layout[col]; row++) {
                let stop = resp[i].num + row;
                stop = (stop >= reelLength) ? (stop - reelLength) : stop;
                stops[col][row] = stop;
            }
        }
        return stops;
    }
}
exports.CreateStops = CreateStops;
