import { SlotConditionMath } from "../models/slot_math_model";
import { SlotFeaturesState, SlotSpinState } from "../models/slot_state_model";

export class SpinCondition {

    static WinCondition( condition :SlotConditionMath, state :SlotSpinState) : SlotFeaturesState {
        const feature :SlotFeaturesState = new SlotFeaturesState();
        feature.isActive = state.win.isGreaterThan(0);
        feature.id = condition.id;
        feature.symbol = -1;
        return feature;
    }

}
