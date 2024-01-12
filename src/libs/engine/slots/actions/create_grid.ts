import { IRandom } from "../../generic/rng/random";
import { WeightedSymbols } from "../models/slot_math_model";
import { RandomHelper } from "../utils/random";

export class CreateGrid {

    static StandardGrid( reelSet:number[][], stops:number[][]) : number[][] {
        const colLen:number = stops.length;
        const grid:number[][] = [];
        for (let col = 0; col < colLen; col++) {
            grid[col] = [];
            for (let row = 0; row < stops[col].length; row++) {
                grid[col][row] = reelSet[col][stops[col][row]];
            }
        }
        return grid;
    }

    static WeightedSymbolGrid(rng:IRandom, reelSet:WeightedSymbols[], layout:number[]) : number[][] {
        const grid = [];
        layout.forEach( (reel, index) => {
            grid[index] = [];
            for (let i=0; i<reel; i++) {
                const symbol :WeightedSymbols = RandomHelper.GetRandomFromList(rng, reelSet) as WeightedSymbols;
                grid[index].push( symbol.symbol);
            }
        })
        return grid;
    }

}