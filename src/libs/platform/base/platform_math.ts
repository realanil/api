import BigNumber from "bignumber.js";
import { SlotMath } from "../../engine/slots/models/slot_math_model";

export class PlatformMath extends SlotMath {

    public defaultBet :number = 1;
    public bets :number[] = [ 0.5, 1, 2, 5, 10 ];
}
