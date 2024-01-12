import { SlotState } from "../models/slot_state_model";

export class UpdateFeature{

    static updateFreeSpinCount( state:SlotState){
        state.freespin.left--;
        if (state.freespin.left === 0){
            state.gameStatus.nextAction = ["spin"];
        }
    }

    static updateReSpinCount( state:SlotState){
        state.respin.left--;
        if (state.respin.left === 0){
            state.gameStatus.nextAction = ["spin"];
        }
    }

    static updateFreeReSpinCount( state:SlotState){
        state.freerespin.left--;
        if (state.freerespin.left === 0){
            state.gameStatus.nextAction = ["freespin"];
        }
    }

}