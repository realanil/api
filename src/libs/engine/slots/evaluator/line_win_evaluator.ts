import BigNumber from "bignumber.js";
import { SlotSpinWinsState } from "../models/slot_state_model";
import { SlotInfoMath } from "../models/slot_math_model";

export class LineWinEvaluator {

    public calculateWins(info :SlotInfoMath, grid :number[][], line :number, stake :BigNumber) :SlotSpinWinsState {
        let symbolOccurrenceCount :number = 0;
        let consecutiveWildCount :number = 0;
        let symbolId :number = -1;
        let wildSymbolId :number = -1;
        let isWildInclude :boolean = false;
        let offsets :number[] = info.payLines[line];

        for (let reel :number = 0; reel < grid.length; reel++) {
            const currSymbolId :number = grid[reel][ offsets[reel]];
            const isSymbolWild :boolean = info.wildSymbols.includes( currSymbolId); 

            if (symbolId == -1 && isSymbolWild) {
                symbolOccurrenceCount++;
                consecutiveWildCount++;
                wildSymbolId = currSymbolId;
                isWildInclude = true;
                continue;
            }

            if (symbolId == -1 && !isSymbolWild) {
                symbolId = currSymbolId;
                symbolOccurrenceCount++;
                continue;
            }

            if (symbolId == currSymbolId || isSymbolWild) {
                if (isSymbolWild) {
                    isWildInclude = true;
                }
                symbolOccurrenceCount++;
            } else {
                break;
            }
        }

        let wildWin :BigNumber = new BigNumber(0);
        let symbolWin :BigNumber = new BigNumber(0);
        info.symbols.forEach( symbol => {
            if (symbol.payout.length === 0) {
                return;
            }

            if ( symbol.id === wildSymbolId ) {
                wildWin = symbol.payout[ consecutiveWildCount];
            }
            if ( symbol.id === symbolId ) {
                symbolWin = symbol.payout[ symbolOccurrenceCount];
            }
        });
        
        const payout :SlotSpinWinsState = new SlotSpinWinsState();
        payout.id = line + 1;
        payout.type = "line";
        payout.wildIncluded = isWildInclude;

        if (wildWin.isGreaterThan(symbolWin) ){
            payout.symbol = wildSymbolId;
            payout.offsets = this.getOffSet( consecutiveWildCount, offsets);
            payout.pay = wildWin.multipliedBy(stake);
        } else {
            payout.symbol = symbolId;
            payout.offsets = this.getOffSet( symbolOccurrenceCount , offsets);
            payout.pay = symbolWin.multipliedBy(stake);
        }

        return payout;
    }

    protected getOffSet( length :number, payLine :number[]) : number[] {
        const offSet :number[] = [];
        for (let i :number = 0; i < length; i++) {
            offSet[i] = (payLine.length * payLine[i]) + i;
        }
        return offSet;
    }
}
