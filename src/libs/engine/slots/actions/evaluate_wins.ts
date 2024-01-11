import BigNumber from "bignumber.js";
import { LineWinEvaluator } from "../evaluator/line_win_evaluator";
import { SlotSpinWinsState } from "../models/slot_state_model";
import { SlotInfoMath } from "../models/slot_math_model";

export class EvaluateWins {

    static LineWins( info :SlotInfoMath, grid:number[][], stake :BigNumber ) :SlotSpinWinsState[] {
        const evaluator :LineWinEvaluator = new LineWinEvaluator();

        const payouts :SlotSpinWinsState[] = [];
        info.payLines.forEach( (offsets :number[], line :number) => {
            const payout :SlotSpinWinsState = evaluator.calculateWins(info, grid, line, stake);
            if (payout != null && payout.pay.isGreaterThan(0)) {
                payouts.push(payout);
            }
        });

        return payouts;
    }

}
