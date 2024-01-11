import BigNumber from "bignumber.js";

export class SlotMath {
    public info : SlotInfoMath = new SlotInfoMath();
    public paidReels : SlotReelsMath[] = [];
    public conditions :SlotConditionMath[] = [];
    public actions :SlotActionMath[] = [];
    public defaultgrid :number[][] = [];

    protected bd( v : number) : BigNumber { return new BigNumber( v); } 
}

export class SlotInfoMath {
    public betMultiplier : BigNumber = new BigNumber(0);
    public gridLayout : number[] = [];
    public wildSymbols : number[] = [];
    public payLines : number[][] = [];
    public symbols : SlotSymbolsMath[] = [];
}

class SlotSymbolsMath {
    public payout : BigNumber[] = [];
    public name : string = "";
    public id : number = -1;
}

class SlotReelsMath {
    public id : string = "";
    public reels : number[][] = [];
    public symbols :WeightedSymbols[] = [];
}

export class WeightedSymbols{
    public symbol :number = -1;
    public weight :number = -1;
}

export class SlotConditionMath {
    public symbol :number = -1;
    public id :string = null;
    public oak?:number[] = null;
    public minCount?:number = -1;
    public maxCount?:number = -1;
}

export class SlotActionMath {
    public payout?:BigNumber = new BigNumber(0);
    public triggers?:string[] = [];
    public spins :number = -1;
}

