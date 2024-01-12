import { IRandom, RandomObj } from "../../generic/rng/random";
import { Cloner } from "../utils/cloner";

export class CreateStops {

    static StandardStopsForNulls ( initialStop:number[], reelSet:number[][], grid:number[][]) :number[][]{
        const newStops = Cloner.CloneGrid( grid);

        for(let col :number=0; col < newStops.length; col ++){
            const reelLength:number = reelSet[col].length;
            for(let row :number=0; row < newStops[col].length; row ++){
                if ( newStops[col][row] === -1 ){
                    let stop:number = initialStop[col] - row - 1;
                    stop = (stop < 0) ? (reelLength + stop) : stop;
                    newStops[col][row] = stop;
                } else {
                    break;
                }
            }
        }
        return newStops;
    }

    static StandardReverseStopsForNulls ( initialStop:number[], reelSet:number[][], grid:number[][]) :number[][]{
        const newStops = Cloner.CloneGrid( grid);

        for(let col :number=0; col < newStops.length; col ++){
            const reelLength:number = reelSet[col].length;
            for(let row :number=0; row < newStops[col].length; row ++){
                if ( newStops[col][row] === -1 ){
                    let stop:number = initialStop[col] + row + 1;
                    stop = (stop < 0) ? (reelLength + stop) : stop;
                    newStops[col][row] = stop;
                } 
            }
        }
        return newStops;
    }

    

    static StandardStopsFromStops (prestop:number[], reelSet:number[][], layout:number[]) : number[][] {

        const stops:number[][] = [];
        for (let i = 0; i < prestop.length; i++) {
            const col:number = prestop[i];
            stops[col] = [];

            const reelLength:number = reelSet[col].length;
            for (let row = 0; row < layout[col]; row++) {
                let stop:number = prestop[i] + row;
                stop = (stop >= reelLength) ? (stop - reelLength) : stop;
                stops[col][row] = stop;
            }
        }
        return stops;
    }

    static StandardStops (rng:IRandom, reelSet:number[][], layout:number[]) : number[][] {
        const req:RandomObj[] = [];
        for (let r = 0; r < reelSet.length; r++) {
            req[r] = new RandomObj(0, reelSet[r].length, r);
        }

        const resp:RandomObj[] = rng.getRandoms(req);

        const stops:number[][] = [];
        for (let i = 0; i < resp.length; i++) {
            const col:number = resp[i].index;
            stops[col] = [];

            const reelLength:number = reelSet[col].length;
            for (let row = 0; row < layout[col]; row++) {
                let stop:number = resp[i].num + row;
                stop = (stop >= reelLength) ? (stop - reelLength) : stop;
                stops[col][row] = stop;
            }
        }
        return stops;

    }

}
