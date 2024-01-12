import BigNumber from "bignumber.js";

export class SlotMath {
    public info:SlotInfoMath = new SlotInfoMath();
    public paidReels:SlotReelsMath[] = [];
    public freeReels:SlotReelsMath[] = [];
    public reSpinReels:SlotReelsMath[] = [];
    public freeReSpinReels:SlotReelsMath[] = [];
    public paidFeatureReels:SlotReelsMath[] = [];
    public conditions:Map<string, SlotConditionMath> = new Map();
    public collection:Map<string, SlotCollectionMath> = new Map(); 
    public actions:Map<string, SlotActionMath> = new Map();
    public defaultgrid:number[][] = [];
    public buyBonus:BuyBonusMath[] = [];

    protected bd( v:number):BigNumber { return new BigNumber( v); } 
}

class BuyBonusMath{
    public id:string ;
    public cost:number;
}

class SlotCollectionMath {
    public count?:number;
    public id?:string;
    public level?:string;
    public from?:number;
    public to?:number;
    public numlist?:number[];
    public weight?:number;
    public collections?:SlotCollectionMath[];
}

export class SlotInfoMath {
    public betMultiplier:BigNumber = new BigNumber(0);
    public gridLayout:number[] = [];
    public wildSymbols:number[] = [];
    public payLines:number[][] = [];
    public symbols:SlotSymbolsMath[] = [];
}

class SlotSymbolsMath {
    public payout:BigNumber[] = [];
    public name:string = "";
    public id:number = -1;
    public key?:string;
}

class SlotReelsMath {
    public id:string = "";
    public reels?:number[][] = [];
    public symbols?:WeightedSymbols[] = [];
    public weight:number = -1;
}

export class WeightedSymbols{
    public symbol:number = -1;
    public weight:number = -1;
}

export class IsAvailable {
    public available:boolean = false;
    public weight:number = -1;
}

export class SlotConditionMath {
    public symbol?:number = -1;
    public id:string = null;
    public oak?:number[] = null;
    public minCount?:number = -1;
    public maxCount?:number = -1;
    public isAvailable?:IsAvailable[];
}

export class SlotActionMath {
    public payout?:BigNumber = new BigNumber(0);
    public triggers?:string[] = [];
    public spins?:number = -1;
    public features?:SlotFeatureMath[][] = null;
    public feature?:SlotFeatureMath[] = null;
    public id?:string = null;
}

class SlotFeatureMath { 
    public weight:number = 0;
    public id:string;
    public symbols?:number[];
}

