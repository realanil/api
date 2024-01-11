import { IRandom, RandomObj } from "../../generic/rng/random";

export class RandomHelper {

    static GetRandomFromList(rng :IRandom, list: {weight:number}[]) : {weight:number} {
        if ( !list || list.length == 0) throw new Error("Empty List") ;

        if (list.length == 1) return list[0];

        let totalWeight :number = 0;
        list.forEach( item => {
            totalWeight += item.weight;
        });

        const random :RandomObj = rng.getRandom(new RandomObj(0, totalWeight, -1));
        return this.GetObjectFromList( random.num, list);
    }

    static GetObjectFromList(randomNumber:number, list:{weight:number}[]):{weight:number} {
        if (!list ||list.length == 0) throw new Error("Empty List") ;

        if (list.length == 1) return list[0];

        let weightSum: number = 0;
        for (let i=0; i< list.length; i++) {
            weightSum += list[i].weight;
            if (randomNumber < weightSum) return list[i];
        }
        return null;
}


}