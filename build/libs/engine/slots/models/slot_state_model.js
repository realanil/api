"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeState = exports.SlotFeaturesState = exports.SlotSpinWinsState = exports.SlotSpinState = exports.BuyBonusDetails = exports.FeatureDetails = exports.SlotState = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const game_state_model_1 = require("../../generic/models/game_state_model");
class SlotState extends game_state_model_1.GameState {
    constructor() {
        super(...arguments);
        this.paidSpin = [];
    }
}
exports.SlotState = SlotState;
class FeatureDetails {
}
exports.FeatureDetails = FeatureDetails;
class BuyBonusDetails {
    constructor() {
        this.isBonusSpin = false;
        this.id = "";
        this.cost = new bignumber_js_1.default(1);
    }
}
exports.BuyBonusDetails = BuyBonusDetails;
class SlotSpinState {
    constructor() {
        this.reelId = null;
        this.stops = [[]];
        this.initialGrid = [[]];
        this.finalGrid = [[]];
        this.win = new bignumber_js_1.default(0);
        this.multiplier = 1;
        this.prevMultiplier = 1;
    }
}
exports.SlotSpinState = SlotSpinState;
class SlotSpinWinsState {
    constructor() {
        this.multiplier = null;
    }
}
exports.SlotSpinWinsState = SlotSpinWinsState;
class SlotFeaturesState {
    constructor() {
        this.symbol = -1;
    }
}
exports.SlotFeaturesState = SlotFeaturesState;
class CascadeState {
    constructor() {
        this.win = new bignumber_js_1.default(0);
    }
}
exports.CascadeState = CascadeState;
