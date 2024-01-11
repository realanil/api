"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinCondition = void 0;
var slot_state_model_1 = require("../models/slot_state_model");
var SpinCondition = /** @class */ (function () {
    function SpinCondition() {
    }
    SpinCondition.WinCondition = function (condition, state) {
        var feature = new slot_state_model_1.SlotFeaturesState();
        feature.isActive = state.win.isGreaterThan(0);
        feature.id = condition.id;
        feature.symbol = -1;
        return feature;
    };
    return SpinCondition;
}());
exports.SpinCondition = SpinCondition;
