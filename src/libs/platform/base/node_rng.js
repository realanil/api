"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRNG = void 0;
var Random_1 = require("../../engine/generic/rng/Random");
var NodeRNG = /** @class */ (function () {
    function NodeRNG() {
        this.cheat = [];
    }
    NodeRNG.prototype.getRandom = function (req) {
        var resp = new Random_1.RandomObj(req.min, req.max, req.index);
        var num = this.cheat.length > 0 ? this.cheat.shift() : Math.floor(Math.random() * (req.max - req.min)) + req.min;
        resp.num = num;
        return resp;
    };
    NodeRNG.prototype.getRandoms = function (req) {
        var _this = this;
        var resp = [];
        req.forEach(function (e) {
            resp.push(_this.getRandom(e));
        });
        return resp;
    };
    NodeRNG.prototype.setCheat = function (cheat) {
        this.cheat = [];
        if (cheat === null || cheat === undefined || cheat.length === 0) {
            return;
        }
        this.cheat = cheat;
    };
    return NodeRNG;
}());
exports.NodeRNG = NodeRNG;
