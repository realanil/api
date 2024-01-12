import BigNumber from "bignumber.js";
import { SlotState } from "../../../libs/engine/slots/models/slot_state_model";
import { PlayResponseModel } from "../../../libs/platform/slots/play_response_model";
import { SlotocrashState } from "./slotocrash_state";

export class SlotCrashResponseModel extends PlayResponseModel {

    public collectedWin :BigNumber;
    public isCollected :boolean;

    constructor( version:string, name:string, error :string, state:SlotState ) {
        super( version, name, error, state);

        const s :SlotocrashState = state as SlotocrashState;
        this.collectedWin = s.collectedWin || new BigNumber(0);
        this.isCollected = s.isCollected || false; 
    }
}