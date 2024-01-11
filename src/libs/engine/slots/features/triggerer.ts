import BigNumber from "bignumber.js";
import { SlotActionMath } from "../models/slot_math_model";
import { FeatureDetails, SlotFeaturesState, SlotSpinState, SlotState } from "../models/slot_state_model";

export class Triggerer {

    static UpdateNextAction( state :SlotState, action :SlotActionMath){
        if ( action.triggers.includes( "freespin") || action.triggers.includes( "respin") || action.triggers.includes( "freerespin") ) {
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
            state.freespin.retrigger = 0;
            state.freespin.accumulated = new BigNumber(0);
            state.freespins = [];
        }

        if ( action.triggers.includes( "respin") ) {
            state.respin = new FeatureDetails();
            state.respin.left = action.spins;
            state.respin.total = action.spins;
            state.respin.retrigger = 0;
            state.respin.accumulated = new BigNumber(0);
            state.respins = [];
        }

        if ( action.triggers.includes( "freerespin") ) {
            state.freerespin = new FeatureDetails();
            state.freerespin.left = action.spins;
            state.freerespin.total = action.spins;
            state.freerespin.retrigger = 0;
            state.freerespin.accumulated = new BigNumber(0);
            state.freerespins = [];
        }
        
        if ( action.triggers.includes( "retrigger") ) {
            state.freespin.left += action.spins;
            state.freespin.total += action.spins;
            state.freespin.retrigger = action.spins;
        }
    }

} 
