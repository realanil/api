import BigNumber from "bignumber.js";
import { SlotSpinWinsState } from "../../../libs/engine/slots/models/slot_state_model";
import { Grid } from "../../../libs/engine/slots/utils/grid";
import { SlotocrashMath } from "../models/slotocrash_math";

export class CustomWins {

    static EvaluateNewReelWin(grid:number[][], stake: BigNumber, math :SlotocrashMath): SlotSpinWinsState[] {
        
        const lastSymbol :number = grid[ grid.length-1 ][0];
        if (lastSymbol === math.blastSymbol) {
            return [];
        }

        const wins :SlotSpinWinsState[] = [];
        math.info.symbols.forEach( symbol => {
            if (symbol.payout && symbol.payout.length > 0 ) {
                if ( symbol.id === lastSymbol) {
                    const win :SlotSpinWinsState = new SlotSpinWinsState();
                    win.symbol = symbol.id;
                    win.offsets = [grid.length-1];
                    win.pay = stake.multipliedBy( symbol.payout[1] );
                    wins.push( win );
                }
            }
        });

        return wins;
    }

    static EvaluateWin( grid:number[][], stake: BigNumber, math :SlotocrashMath ) :SlotSpinWinsState[]{
        const wins :SlotSpinWinsState[] = [];

        const blasts :number[] = Grid.FindScatterOffsets(math.blastSymbol, grid);
        if (blasts.length > 0) {
            return wins;
        }

        math.info.symbols.forEach( symbol => {
            if (symbol.payout && symbol.payout.length > 0 ) {
                const offsets :number[] = Grid.FindScatterOffsets( symbol.id, grid);
                if (offsets.length > 0) {
                    const win :SlotSpinWinsState = new SlotSpinWinsState();
                    win.symbol = symbol.id;
                    win.offsets = offsets;
                    win.pay = stake.multipliedBy( symbol.payout[1] ).multipliedBy( offsets.length ) ;
                    wins.push( win );
                }
            }
        });

        return wins;
    }

}