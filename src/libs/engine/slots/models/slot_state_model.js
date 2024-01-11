"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeState = exports.SlotFeaturesState = exports.SlotSpinWinsState = exports.SlotSpinState = exports.FeatureDetails = exports.SlotState = void 0;
var bignumber_js_1 = require("bignumber.js");
var game_state_model_1 = require("../../generic/models/game_state_model");
var SlotState = /** @class */ (function (_super) {
    __extends(SlotState, _super);
    function SlotState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.paidSpin = [];
        return _this;
    }
    return SlotState;
}(game_state_model_1.GameState));
exports.SlotState = SlotState;
var FeatureDetails = /** @class */ (function () {
    function FeatureDetails() {
    }
    return FeatureDetails;
}());
exports.FeatureDetails = FeatureDetails;
var SlotSpinState = /** @class */ (function () {
    function SlotSpinState() {
        this.stops = [[]];
        this.initialGrid = [[]];
        this.finalGrid = [[]];
        this.win = new bignumber_js_1.default(0);
        this.multiplier = 1;
    }
    return SlotSpinState;
}());
exports.SlotSpinState = SlotSpinState;
var SlotSpinWinsState = /** @class */ (function () {
    function SlotSpinWinsState() {
    }
    return SlotSpinWinsState;
}());
exports.SlotSpinWinsState = SlotSpinWinsState;
var SlotFeaturesState = /** @class */ (function () {
    function SlotFeaturesState() {
        this.symbol = -1;
    }
    return SlotFeaturesState;
}());
exports.SlotFeaturesState = SlotFeaturesState;
var CascadeState = /** @class */ (function () {
    function CascadeState() {
        this.win = new bignumber_js_1.default(0);
    }
    return CascadeState;
}());
exports.CascadeState = CascadeState;
