import BigNumber from "bignumber.js";
import { SlotSpinWinsState } from "../models/slot_state_model";

export class CalculateWins {

    static AddPays( wins :SlotSpinWinsState[] ) :BigNumber {
        let pay :BigNumber = new BigNumber(0);
        wins.forEach( win => {
            pay = pay.plus( win.pay);
        })
        return pay;
    }

}
