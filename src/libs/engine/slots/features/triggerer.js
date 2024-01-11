"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triggerer = void 0;
var bignumber_js_1 = require("bignumber.js");
var slot_state_model_1 = require("../models/slot_state_model");
var Triggerer = /** @class */ (function () {
    function Triggerer() {
    }
    Triggerer.UpdateNextAction = function (state, action) {
        if (action.triggers.includes("freespin")) {
            state.gameStatus.nextAction = action.triggers;
        }
    };
    Triggerer.UpdateFeature = function (state, feature, action) {
        feature.triggers = action.triggers;
        feature.count = action.spins;
        if (action.triggers.includes("freespin")) {
            state.freespin = new slot_state_model_1.FeatureDetails();
            state.freespin.left = action.spins;
            state.freespin.total = action.spins;
            state.freespin.accumulated = new bignumber_js_1.default(0);
        }
        if (action.triggers.includes("retrigger")) {
            state.freespin.left += action.spins;
        }
    };
    return Triggerer;
}());
exports.Triggerer = Triggerer;
