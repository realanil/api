import { Cloner } from "./cloner";

export class Grid {

    static FirstStopFromStops( grid :number[][] ) :number[] {
        const stops :number[] = [];
        grid.forEach( (reel, index) => {
            stops[index] = reel[0];
        });
        return stops;
    }

    static MarkOffsets( grid :number[][], offsets :number[] ) {
        offsets.forEach( offset => {
            const col :number = offset % grid.length
            const row :number = Math.floor(offset / grid.length);
            grid[col][row] = -1;
        })
    }

    static MoveMarkedOffsetsDown ( grid :number[][]) :number[][] {
        const newgrid :number[][] = [[]];

        for(let col :number=0; col < grid.length; col ++){
            newgrid[col] = [];
            for(let row :number=0; row < grid[col].length; row ++){
                if (grid[col][row] === -1) {
                    newgrid[col].push( grid[col][row]);
                }
            }
        }

        for(let col :number=0; col < grid.length; col ++){
            for(let row :number=0; row < grid[col].length; row ++){
                if (grid[col][row] !== -1) {
                    newgrid[col].push( grid[col][row]);
                }
            }
        }

        return newgrid;
    }

    static FindScatterOffsets(symbol :number, grid :number[][]) :number[] {
        const offsets :number[] = [];
        for (let reel :number = 0; reel < grid.length; reel++) {
            for (let row :number = 0; row < grid[reel].length; row++) {
                if (grid[reel][row] == symbol) {
                    offsets.push( grid.length * row + reel);
                }
            }
        }
        return offsets;
    }

}