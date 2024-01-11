"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWins = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const slot_state_model_1 = require("../../../libs/engine/slots/models/slot_state_model");
const grid_1 = require("../../../libs/engine/slots/utils/grid");
const random_1 = require("../../../libs/engine/slots/utils/random");
class CustomWins {
    static EvaluateGoldWin(rng, math, grid, stake) {
        const payouts = [];
        let isSet2Selected = false;
        const offsets = grid_1.Grid.FindScatterOffsets(math.goldSymbolId, grid);
        offsets.forEach(offset => {
            const multiplierList = isSet2Selected ? math.goldMultiplier[0] : random_1.RandomHelper.GetRandomFromList(rng, math.goldMultiplier);
            if (multiplierList.id == "set2") {
                isSet2Selected = true;
            }
            const multiplier = random_1.RandomHelper.GetRandomFromList(rng, multiplierList.multipliers);
            const payout = new slot_state_model_1.SlotSpinWinsState();
            payout.symbol = math.goldSymbolId;
            payout.offsets = [offset];
            payout.type = "gold";
            payout.id = 0;
            payout.multiplier = multiplier.multiplier;
            payout.pay = new bignumber_js_1.default(multiplier.multiplier).multipliedBy(stake);
            payouts.push(payout);
        });
        return payouts;
    }
}
exports.CustomWins = CustomWins;
