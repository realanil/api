import { IRandom } from "../../generic/rng/random";
import { SlotConditionMath } from "../models/slot_math_model";
import { SlotFeaturesState } from "../models/slot_state_model";
import { RandomHelper } from "../utils/random";

export class RandomCondition {
    
    static IsAvailable( condition :SlotConditionMath, rng :IRandom) : SlotFeaturesState {
        const isMysteryFeature :any = RandomHelper.GetRandomFromList( rng, condition.isAvailable );

        const feature :SlotFeaturesState = new SlotFeaturesState();
        feature.id = condition.id;
        feature.isActive = isMysteryFeature.available;
        feature.symbol = condition.symbol;
        return feature;
    }
}