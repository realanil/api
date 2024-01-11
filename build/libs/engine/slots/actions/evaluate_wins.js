"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateWins = void 0;
const line_win_evaluator_1 = require("../evaluator/line_win_evaluator");
const ways_win_evaluator_1 = require("../evaluator/ways_win_evaluator");
class EvaluateWins {
    static LineWins(info, grid, stake) {
        const evaluator = new line_win_evaluator_1.LineWinEvaluator();
        const payouts = [];
        info.payLines.forEach((offsets, line) => {
            const payout = evaluator.calculateWins(info, grid, line, stake);
            if (payout != null && payout.pay.isGreaterThan(0)) {
                payouts.push(payout);
            }
        });
        return payouts;
    }
    static WaysWins(info, grid, stake, multiplier) {
        const evaluator = new ways_win_evaluator_1.WaysWinEvaluator();
        const payouts = evaluator.calculateWins(info, grid, stake, multiplier);
        return payouts;
    }
}
exports.EvaluateWins = EvaluateWins;
