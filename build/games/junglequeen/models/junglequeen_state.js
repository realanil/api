"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JungleQueenState = void 0;
const slot_state_model_1 = require("../../../libs/engine/slots/models/slot_state_model");
class JungleQueenState extends slot_state_model_1.SlotState {
    constructor() {
        super(...arguments);
        this.mystrySymbolCount = 0;
        this.mystryLevel = 0;
        this.multiplier = 0;
    }
}
exports.JungleQueenState = JungleQueenState;
