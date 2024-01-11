import BigNumber from "bignumber.js";
import { SlotSpinWinsState } from "../../../libs/engine/slots/models/slot_state_model";
import { JungleQueenMath } from "../models/junglequeen_math";
import { Grid } from "../../../libs/engine/slots/utils/grid";
import { IRandom } from "../../../libs/engine/generic/rng/random";
import { RandomHelper } from "../../../libs/engine/slots/utils/random";

export class CustomWins {

    public static EvaluateGoldWin (rng:IRandom, math:JungleQueenMath, grid:number[][], stake:BigNumber ):SlotSpinWinsState[] {
        const payouts:SlotSpinWinsState[] = [];

        let isSet2Selected:boolean = false;
        const offsets:number[] = Grid.FindScatterOffsets( math.goldSymbolId, grid );
        offsets.forEach( offset => {

            const multiplierList:any = isSet2Selected ? math.goldMultiplier[0]:RandomHelper.GetRandomFromList(rng, math.goldMultiplier);

            if (multiplierList.id == "set2" ) {
                isSet2Selected = true;
            }
            const multiplier:any = RandomHelper.GetRandomFromList(rng, multiplierList.multipliers )

            const payout:SlotSpinWinsState = new SlotSpinWinsState();
            payout.symbol = math.goldSymbolId;
            payout.offsets = [offset];
            payout.type = "gold";
            payout.id = 0;
            payout.multiplier = multiplier.multiplier;
            payout.pay = new BigNumber(multiplier.multiplier).multipliedBy(stake); 
            payouts.push( payout);
        })

        return payouts;
    } 

} 
