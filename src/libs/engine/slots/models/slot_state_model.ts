import BigNumber from "bignumber.js";
import { GameState } from "../../generic/models/game_state_model";

export class SlotState extends GameState {

    public freespin:FeatureDetails;
    public respin:FeatureDetails;
    public freerespin:FeatureDetails;

    public freespins:SlotSpinState[][];
    public respins:SlotSpinState[][];
    public freerespins:SlotSpinState[][];
    
    public paidSpin:SlotSpinState[] = [];
    public buybonus:BuyBonusDetails;
}

export class FeatureDetails{
    public total:number;
    public left:number;
    public retrigger:number;
    public accumulated:BigNumber;
}

export class BuyBonusDetails{
    public isBonusSpin:boolean = false;
    public id:string = "";
    public cost:BigNumber = new BigNumber(1);
}

export class SlotSpinState {
    public reelId:string = null;
    public stops:number[][] = [[]];
    public initialGrid:number[][] = [[]];
    public finalGrid:number[][] = [[]];
    public win:BigNumber = new BigNumber(0);
    public wins:SlotSpinWinsState[];
    public cascade:CascadeState;
    public multiplier:number = 1;
    public multipliers?:number[];
    public features:SlotFeaturesState[];
    public prevMultiplier:number = 1;
}

export class SlotSpinWinsState {
    public symbol:number;
    public pay:BigNumber;
    public offsets:number[];
    public id:number;
    public type:string;
    public wildIncluded:boolean;
    public multiplier:number = null;
}

export class SlotFeaturesState {
    public id:string;
    public isActive:boolean;
    public symbol:number = -1;
    public offsets:number[];
    public triggers:string[];
    public count:number;
    public level:string;
}

export class CascadeState {
    public id:number;
    public offsets:number[]; 
    public type:string;
    public win:BigNumber = new BigNumber(0);
}
