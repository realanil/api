"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotTester = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const payout_tester_1 = require("../../generic/tester/payout-tester");
class SlotTester extends payout_tester_1.PayoutTester {
    constructor() {
        super();
        this.buybonus = false;
        this.createSlotKeys();
        require('dotenv').config();
    }
    createSlotKeys() {
        this.createPayoutKey("main-spins", "summery", 10);
        this.createPayoutKey("freespin-spins", "summery", 12);
        let priority = 5000;
        for (let s = 0; s < 20; s++) {
            for (let oak = 0; oak < 9; oak++) {
                this.createPayoutKey(`main-${s}-${oak}oak`, 'mainspin', priority++);
            }
        }
        for (let s = 0; s < 20; s++) {
            for (let oak = 0; oak < 9; oak++) {
                this.createPayoutKey(`freespin-${s}-${oak}oak`, 'freespin', priority++);
            }
        }
    }
    recordSlotRTP(state) {
        switch (state.gameStatus.action) {
            case "spin":
                this.recordSlotSpinRTP("main", state.paidSpin[0], true);
                break;
            case "buybonus":
                this.recordSlotSpinRTP("main", state.paidSpin[0], true);
                break;
            case "freespin":
                const lastFS = this.isLastFreeSpin(state);
                this.recordSlotSpinRTP("freespin", state.freespins[state.freespins.length - 1][0], lastFS);
                break;
        }
    }
    isLastFreeSpin(state) {
        return state.gameStatus.action === "freespin" && state.gameStatus.nextAction.includes("spin");
    }
    recordSlotSpinRTP(key, state, isLastSpin) {
        this.updatePayout(`${key}-spins`, state.win);
        this.createPayoutKey(`${key}-reel-${state.reelId}`, "reels", 50);
        this.updatePayout(`${key}-reel-${state.reelId}`, state.win);
        let multiplier = state.multiplier.toString();
        if (multiplier.length == 2)
            multiplier = "0" + multiplier;
        if (multiplier.length == 1)
            multiplier = "00" + multiplier;
        this.createPayoutKey(`${key}-x${multiplier}`, "multiplier", 500);
        this.updateKeyCount(`${key}-x${multiplier}`);
        if (isLastSpin && key !== "main") {
            this.createPayoutKey(`last-${key}-x${multiplier}`, "final-multiplier", 600);
            this.updateKeyCount(`last-${key}-x${multiplier}`);
        }
        this.recordSymbolRTP(state, key);
        state.features.forEach(feature => {
            this.createPayoutKey(`${key}-${feature.id}`, `feature`, 100);
            if (feature.isActive) {
                this.updateKeyCount(`${key}-${feature.id}`);
                this.recordFeatureDetils(key, feature, state, isLastSpin);
            }
        });
    }
    recordFeatureDetils(key, feature, state, isLastSpin) {
        const p = { "main": 3000, "freespin": 4000 };
        switch (feature.id) {
            case "mystery":
                this.recordMysteryDetails(key, feature, p[key], state, isLastSpin);
                break;
        }
    }
    recordMysteryDetails(key, feature, priority, state, isLastSpin) {
        const pkey = `${key}-${feature.id}-symbol-${feature.symbol}`;
        this.createPayoutKey(pkey, `${key}feature-details`, priority);
        this.updateKeyCount(pkey);
    }
    recordSymbolRTP(state, id) {
        state.wins.forEach(win => {
            const key = `${id}-${win.symbol}-${win.offsets.length}oak`;
            this.updatePayout(key, win.pay);
        });
    }
    calculateGameRTP() {
        if (["spin", "buybonus"].includes(this.state.gameStatus.action)) {
            this.updateTotalBetAndWin(this.state.gameStatus.totalBet, new bignumber_js_1.default(0));
        }
        this.updateTotalBetAndWin(new bignumber_js_1.default(0), this.state.gameStatus.currentWin);
    }
}
exports.SlotTester = SlotTester;
