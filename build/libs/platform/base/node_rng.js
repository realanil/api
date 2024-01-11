"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRNG = void 0;
const random_1 = require("../../engine/generic/rng/random");
const cloner_1 = require("../../engine/slots/utils/cloner");
class NodeRNG {
    constructor() {
        this.cheat = [];
        this.usedNums = [];
    }
    getRandom(req) {
        const resp = new random_1.RandomObj(req.min, req.max, req.index);
        const num = this.cheat.length > 0 ? this.cheat.shift() : Math.floor(Math.random() * (req.max - req.min)) + req.min;
        resp.num = num;
        if (process.env.NODE_ENV === "dev") {
            this.usedNums.push(num);
        }
        return resp;
    }
    getRandoms(req) {
        const resp = [];
        req.forEach(e => {
            resp.push(this.getRandom(e));
        });
        return resp;
    }
    getAndResetUsedNums() {
        const nums = cloner_1.Cloner.CloneObject(this.usedNums);
        this.usedNums = [];
        return nums;
    }
    setCheat(cheat) {
        if (process.env.CHEATS === "true") {
            this.cheat = [];
            if (cheat === null || cheat === undefined || cheat.length === 0) {
                return;
            }
            this.cheat = cheat;
        }
    }
}
exports.NodeRNG = NodeRNG;
