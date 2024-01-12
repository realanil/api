import BigNumber from "bignumber.js";
import { SlotInfoMath } from "../models/slot_math_model";
import { SlotSpinWinsState } from "../models/slot_state_model";
import { Grid } from "../utils/grid";
import { Symbols } from "../utils/symbols";

export class WaysWinEvaluator {

    public calculateWins(info :SlotInfoMath, grid :number[][], bet :BigNumber, multiplier:number) :SlotSpinWinsState[] {
        
        let wins :SlotSpinWinsState[] = [];
        
        const symbolList :number[] = this.getSymbolList(grid, info.wildSymbols);
        symbolList.forEach( symbol => {

            let winOffSets :string[] = [];
            let currentOffSets :string[] = [];
            const wildOffSets :string[] = [];
            let flag :boolean = false;

            for (let reel:number = 0; reel < grid.length; reel++) {
                for (let row:number = 0; row < grid[reel].length; row++) {
                    const currentSymbol :number = grid[reel][row];

                    if (currentSymbol == symbol || info.wildSymbols.includes(currentSymbol) ){
                        const o :number = (grid.length * row) + reel;

                        if (info.wildSymbols.includes(currentSymbol)) {
                            wildOffSets.push( o.toString());
                        } 

                        if (reel == 0){
                            currentOffSets.push ( o.toString());
                        } else {

                            winOffSets.forEach( offset => {
                                currentOffSets.push( offset + "," + o);
                            })
                        }

                        flag = true;
                    }

                }

                if (flag){
                    winOffSets = [].concat( currentOffSets);
                    currentOffSets = [];
                    flag = false;
                } else {
                    break;
                }
            }

            const payouts :SlotSpinWinsState[] = this.calculateWaysWin(info, symbol, winOffSets, wildOffSets, bet, multiplier, 1, grid.length, grid[0].length);
            if (payouts.length > 0) {
                wins = wins.concat(payouts);
            }

        })

        return wins;

    }


    protected calculateWaysWin(info :SlotInfoMath, symbol :number, winOffsets:string[], wildOffsets:string[], bet:BigNumber, multiplier:number, wildMultiplier:number, power:number, baseval:number) :SlotSpinWinsState[] {
        
        const payoutDetails :SlotSpinWinsState[] = [];

        let isWildSubstitude:boolean = false;

        winOffsets.forEach( offsets => {

            const symbolOffSets :string[] = [];
            const symbolOffSetsWithMultiplier :string[] = [];
            const symbolWin :BigNumber[] = [];
            const symbolWinWithMultiplier :number[] = [];
            
            const iOffsets :number[] = offsets.split(",").map( o => parseInt(o) );
            iOffsets.forEach( offset => {
                if (wildOffsets.includes(offset.toString() ) ){
                    isWildSubstitude = true;
                }
            })

            let pay :BigNumber = BigNumber(0);
            info.symbols.forEach( symbolpay => {
                if (symbolpay.payout.length === 0) {
                    return;
                }
                if ( symbolpay.id === symbol && iOffsets.length < symbolpay.payout.length    ) {
                    pay = symbolpay.payout[ iOffsets.length ];
                }
            })

            if (isWildSubstitude && wildMultiplier > 1){

            } else {
                symbolOffSets.push( offsets);
                const finalpay :BigNumber = pay.multipliedBy( bet).multipliedBy( BigNumber(multiplier));
                symbolWin.push( finalpay);
            }

            const finalSymbolWin :BigNumber = symbolWin.reduce( (a:BigNumber, b:BigNumber) => a.plus(b), BigNumber(0) ); 
            if( finalSymbolWin.isGreaterThan( BigNumber(0)) ){
                const payout :SlotSpinWinsState = new SlotSpinWinsState();
                payout.symbol = symbol;
                payout.pay = finalSymbolWin;
                payout.multiplier = multiplier;
                payout.offsets = iOffsets;
                payout.type = "ways";
                payout.wildIncluded = isWildSubstitude;
                payout.id = this.getWaysIndex(baseval, power, iOffsets);

                payoutDetails.push( payout);
            }      

        })

        return payoutDetails;

    }

    protected getWaysIndex(baseval:number, power:number, offsets:number[]) :number {
        let index :number = 0;

        for (let i:number = 0; i < power; i++){
            let row :number = 0;
            if (offsets.length > i) {
                row = offsets[i] / power;
            } if (row > 0) {
                const set:number = (baseval ** (power - i - 1));
                index += (set * row);
            }
        }
        return Math.floor( index + 1) ;
    }

    protected getSymbolList( grid:number[][], wildCollection:number[]): number[]{
        const symbolList :Set<number> = new Set<number>();

        grid[0].forEach( symbol => {
            symbolList.add (symbol );
        })

        return Array.from( symbolList);
    }


}
