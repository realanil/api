"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomCondition = void 0;
const slot_state_model_1 = require("../models/slot_state_model");
const random_1 = require("../utils/random");
class RandomCondition {
    static IsAvailable(condition, rng) {
        const isMysteryFeature = random_1.RandomHelper.GetRandomFromList(rng, condition.isAvailable);
        const feature = new slot_state_model_1.SlotFeaturesState();
        feature.id = condition.id;
        feature.isActive = isMysteryFeature.available;
        feature.symbol = condition.symbol;
        return feature;
    }
}
exports.RandomCondition = RandomCondition;
