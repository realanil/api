import BigNumber from "bignumber.js";
import { GameState } from "../../generic/models/game_state_model";

export class SlotState extends GameState {

    public freespin :FeatureDetails;
    public freespins :SlotSpinState[];
    public paidSpin :SlotSpinState[] = [];
}

export class FeatureDetails{
    public total :number;
    public left :number;
    public accumulated :BigNumber;
}


export class SlotSpinState {
    public stops :number[][] = [[]];
    public initialGrid :number[][] = [[]];
    public finalGrid :number[][] = [[]];
    public win :BigNumber = new BigNumber(0);
    public wins :SlotSpinWinsState[];
    public cascade :CascadeState;
    public multiplier :number = 1;
    public features :SlotFeaturesState[];
}

export class SlotSpinWinsState {
    public symbol :number;
    public pay :BigNumber;
    public offsets :number[];
    public id :number;
    public type :string;
    public wildIncluded :boolean;
}

export class SlotFeaturesState {
    public id :string;
    public isActive :boolean;
    public symbol :number = -1;
    public offsets :number[];
    public triggers :string[];
    public count :number;
}

export class CascadeState {
    public id :number;
    public offsets :number[]; 
    public type :string;
    public win :BigNumber = new BigNumber(0);
}
