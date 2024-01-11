export interface IRandom {
    getRandom : (req : RandomObj) => RandomObj;
    getRandoms : (req : RandomObj[]) => RandomObj[];
}

export class RandomObj {

    public min : number = -1;
    public max : number = -1;
    public index : number = -1;
    public num : number = -1;

    constructor( min:number, max:number, index:number ){
        this.min = min;
        this.max = max;
        this.index = index;
    }
}
