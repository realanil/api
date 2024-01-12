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

    static WinningReelsByOffsets( offsets: number[], layout: number[]) : boolean[] {
        const winsPerReel :number[] = [];
        for(let i=0; i<layout.length; i++) {
            winsPerReel[i] = 0;
        }

        offsets.forEach( (offset:number) => {
            const col :number = offset % layout.length
            winsPerReel[col] += 1;
        })

        const winreels :boolean[] = []
        for(let i=0; i<layout.length; i++) {
            winreels[i] = winsPerReel[i] == layout[i];            
        }

        return winreels
    }

}