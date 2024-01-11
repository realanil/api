import { SlotState } from "../models/slot_state_model";

export class UpdateFeature{

    static updateFreeSpinCount( state:SlotState){
        state.freespin.left--;
        if (state.freespin.left === 0){
            state.gameStatus.nextAction = ["spin"];
        }
    }

}