import BigNumber from "bignumber.js";
import { SlotActionMath } from "../models/slot_math_model";
import { FeatureDetails, SlotFeaturesState, SlotSpinState, SlotState } from "../models/slot_state_model";

export class Triggerer {

    static UpdateNextAction( state :SlotState, action :SlotActionMath){
        if ( action.triggers.includes( "freespin") ) {
            state.gameStatus.nextAction = action.triggers;
        }
    }

    static UpdateFeature( state :SlotState, feature :SlotFeaturesState, action :SlotActionMath ){
        feature.triggers = action.triggers;
        feature.count = action.spins;
        
        if ( action.triggers.includes( "freespin") ) {
            state.freespin = new FeatureDetails();
            state.freespin.left = action.spins;
            state.freespin.total = action.spins;
            state.freespin.accumulated = new BigNumber(0);
        }
        if ( action.triggers.includes( "retrigger") ) {
            state.freespin.left += action.spins;
        }
    }

} 
