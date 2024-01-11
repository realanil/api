import { IRandom } from "../../generic/rng/random";
import { RandomHelper } from "./random";

interface WeightedLayout {
    collections: { count:number, weight:number}[] 
}

export class Layout {

    static weightedLayout( rng:IRandom, details: WeightedLayout[] ) :number[] {
        const layout:number[] = [];

        details.forEach( (detail, index) => { 
            const selected:any = RandomHelper.GetRandomFromList( rng, detail.collections );
            layout[index] = selected.count;
        });

        return layout;
    }
}
