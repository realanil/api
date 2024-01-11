"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeature = void 0;
var UpdateFeature = /** @class */ (function () {
    function UpdateFeature() {
    }
    UpdateFeature.updateFreeSpinCount = function (state) {
        state.freespin.left--;
        if (state.freespin.left === 0) {
            state.gameStatus.nextAction = ["spin"];
        }
    };
    return UpdateFeature;
}());
exports.UpdateFeature = UpdateFeature;
