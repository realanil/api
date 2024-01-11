"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformMath = void 0;
const slot_math_model_1 = require("../../engine/slots/models/slot_math_model");
class PlatformMath extends slot_math_model_1.SlotMath {
    constructor() {
        super(...arguments);
        this.gameConfig = new GameConfig();
        this.defaultBet = 1;
        this.bets = [0.2, 0.5, 1, 2, 5, 10];
        this.payScreenThresholds = [20, 50, 120];
        this.autoPlayValues = [5, 10, 20, 50];
        this.maxCoins = 25000;
    }
}
exports.PlatformMath = PlatformMath;
class GameConfig {
    constructor() {
        this.type = "PAYLINES";
        this.payDirection = "LEFT";
        this.freespins = true;
        this.disableBuyIn = false;
    }
}
