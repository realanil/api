"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JungleQueenResponseModel = void 0;
const responses_v2_1 = require("../../../libs/platform/slots/responses_v2");
class JungleQueenResponseModel extends responses_v2_1.PlayResponseV2Model {
    constructor(version, name, math, state) {
        super(version, name, math, state);
        if (state.gameStatus.action == "freespin") {
            this.state["totalNumMysterySym"] = state.mystrySymbolCount;
            this.state["level"] = state.mystryLevel;
        }
        const playerAction = state.gameStatus.action === "buybonus" ? "spin" : state.gameStatus.action;
        const spins = playerAction === "spin" ? state.paidSpin[0] : state.freespins[state.freespins.length - 1][0];
        spins.features.forEach(feature => {
            if (feature.isActive && feature.id == "mystery")
                this.state["currentMysterySym"] = feature.offsets.length;
        });
    }
}
exports.JungleQueenResponseModel = JungleQueenResponseModel;
