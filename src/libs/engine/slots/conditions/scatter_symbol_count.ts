import { SlotConditionMath } from "../models/slot_math_model";
import { SlotFeaturesState, SlotSpinState } from "../models/slot_state_model";
import { Grid } from "../utils/grid";

export class ScatterSymbolCount {
    
    static checkCondition( condition :SlotConditionMath, state :SlotSpinState) : SlotFeaturesState {
        const feature :SlotFeaturesState = new SlotFeaturesState();
        feature.offsets = Grid.FindScatterOffsets(condition.symbol, state.finalGrid);
        feature.isActive = true;
        feature.id = condition.id;
        feature.symbol = condition.symbol;

        if (feature.isActive && condition.minCount > -1) {
            feature.isActive = feature.offsets.length >= condition.minCount;
        }
        if (feature.isActive && condition.maxCount  > -1) {
            feature.isActive = feature.offsets.length <= condition.maxCount;
        }
        if (feature.isActive && condition.oak !== null && condition.oak !== undefined) {
            feature.isActive = condition.oak.includes( feature.offsets.length) ;
        }
        
        return feature;
    }

}

