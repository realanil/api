"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatus = exports.GameState = void 0;
var bignumber_js_1 = require("bignumber.js");
var GameState = /** @class */ (function () {
    function GameState() {
        this.name = "";
        this.version = "";
        this.error = "";
        this.gameStatus = new GameStatus();
    }
    return GameState;
}());
exports.GameState = GameState;
var GameStatus = /** @class */ (function () {
    function GameStatus() {
        this.action = "";
        this.nextAction = ["spin"];
        this.totalBet = new bignumber_js_1.default(0);
        this.stakeValue = new bignumber_js_1.default(0);
        this.totalWin = new bignumber_js_1.default(0);
        this.currentWin = new bignumber_js_1.default(0);
    }
    return GameStatus;
}());
exports.GameStatus = GameStatus;
