"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotActionMath = exports.SlotConditionMath = exports.WeightedSymbols = exports.SlotInfoMath = exports.SlotMath = void 0;
var bignumber_js_1 = require("bignumber.js");
var SlotMath = /** @class */ (function () {
    function SlotMath() {
        this.info = new SlotInfoMath();
        this.paidReels = [];
        this.conditions = [];
        this.actions = [];
        this.defaultgrid = [];
    }
    SlotMath.prototype.bd = function (v) { return new bignumber_js_1.default(v); };
    return SlotMath;
}());
exports.SlotMath = SlotMath;
var SlotInfoMath = /** @class */ (function () {
    function SlotInfoMath() {
        this.betMultiplier = new bignumber_js_1.default(0);
        this.gridLayout = [];
        this.wildSymbols = [];
        this.payLines = [];
        this.symbols = [];
    }
    return SlotInfoMath;
}());
exports.SlotInfoMath = SlotInfoMath;
var SlotSymbolsMath = /** @class */ (function () {
    function SlotSymbolsMath() {
        this.payout = [];
        this.name = "";
        this.id = -1;
    }
    return SlotSymbolsMath;
}());
var SlotReelsMath = /** @class */ (function () {
    function SlotReelsMath() {
        this.id = "";
        this.reels = [];
        this.symbols = [];
    }
    return SlotReelsMath;
}());
var WeightedSymbols = /** @class */ (function () {
    function WeightedSymbols() {
        this.symbol = -1;
        this.weight = -1;
    }
    return WeightedSymbols;
}());
exports.WeightedSymbols = WeightedSymbols;
var SlotConditionMath = /** @class */ (function () {
    function SlotConditionMath() {
        this.symbol = -1;
        this.id = null;
        this.oak = null;
        this.minCount = -1;
        this.maxCount = -1;
    }
    return SlotConditionMath;
}());
exports.SlotConditionMath = SlotConditionMath;
var SlotActionMath = /** @class */ (function () {
    function SlotActionMath() {
        this.payout = new bignumber_js_1.default(0);
        this.triggers = [];
        this.spins = -1;
    }
    return SlotActionMath;
}());
exports.SlotActionMath = SlotActionMath;
