"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeature = void 0;
class UpdateFeature {
    static updateFreeSpinCount(state) {
        state.freespin.left--;
        if (state.freespin.left === 0) {
            state.gameStatus.nextAction = ["spin"];
        }
    }
    static updateReSpinCount(state) {
        state.respin.left--;
        if (state.respin.left === 0) {
            state.gameStatus.nextAction = ["spin"];
        }
    }
    static updateFreeReSpinCount(state) {
        state.freerespin.left--;
        if (state.freerespin.left === 0) {
            state.gameStatus.nextAction = ["freespin"];
        }
    }
}
exports.UpdateFeature = UpdateFeature;
