import { SlotSpinWinsState } from "../models/slot_state_model";

export class Symbols {

    static UniqueWinningSymbols( wins :SlotSpinWinsState[] ) :number[] {
        const offsets :Set<number> = new Set<number>();
        wins.forEach( win => {
            win.offsets.forEach( offset => {
                offsets.add (offset);
            });
        });
        return Array.from( offsets);
    }

}