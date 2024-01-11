"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaysWinEvaluator = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const slot_state_model_1 = require("../models/slot_state_model");
class WaysWinEvaluator {
    calculateWins(info, grid, bet, multiplier) {
        let wins = [];
        const symbolList = this.getSymbolList(grid, info.wildSymbols);
        symbolList.forEach(symbol => {
            let winOffSets = [];
            let currentOffSets = [];
            const wildOffSets = [];
            let flag = false;
            for (let reel = 0; reel < grid.length; reel++) {
                for (let row = 0; row < grid[reel].length; row++) {
                    const currentSymbol = grid[reel][row];
                    if (currentSymbol == symbol || info.wildSymbols.includes(currentSymbol)) {
                        const o = (grid.length * row) + reel;
                        if (info.wildSymbols.includes(currentSymbol)) {
                            wildOffSets.push(o.toString());
                        }
                        if (reel == 0) {
                            currentOffSets.push(o.toString());
                        }
                        else {
                            winOffSets.forEach(offset => {
                                currentOffSets.push(offset + "," + o);
                            });
                        }
                        flag = true;
                    }
                }
                if (flag) {
                    winOffSets = [].concat(currentOffSets);
                    currentOffSets = [];
                    flag = false;
                }
                else {
                    break;
                }
            }
            const payouts = this.calculateWaysWin(info, symbol, winOffSets, wildOffSets, bet, multiplier, 1, grid.length, grid[0].length);
            if (payouts.length > 0) {
                wins = wins.concat(payouts);
            }
        });
        return wins;
    }
    calculateWaysWin(info, symbol, winOffsets, wildOffsets, bet, multiplier, wildMultiplier, power, baseval) {
        const payoutDetails = [];
        let isWildSubstitude = false;
        winOffsets.forEach(offsets => {
            const symbolOffSets = [];
            const symbolOffSetsWithMultiplier = [];
            const symbolWin = [];
            const symbolWinWithMultiplier = [];
            const iOffsets = offsets.split(",").map(o => parseInt(o));
            iOffsets.forEach(offset => {
                if (wildOffsets.includes(offset.toString())) {
                    isWildSubstitude = true;
                }
            });
            let pay = (0, bignumber_js_1.default)(0);
            info.symbols.forEach(symbolpay => {
                if (symbolpay.payout.length === 0) {
                    return;
                }
                if (symbolpay.id === symbol && iOffsets.length < symbolpay.payout.length) {
                    pay = symbolpay.payout[iOffsets.length];
                }
            });
            if (isWildSubstitude && wildMultiplier > 1) {
            }
            else {
                symbolOffSets.push(offsets);
                const finalpay = pay.multipliedBy(bet).multipliedBy((0, bignumber_js_1.default)(multiplier));
                symbolWin.push(finalpay);
            }
            const finalSymbolWin = symbolWin.reduce((a, b) => a.plus(b), (0, bignumber_js_1.default)(0));
            if (finalSymbolWin.isGreaterThan((0, bignumber_js_1.default)(0))) {
                const payout = new slot_state_model_1.SlotSpinWinsState();
                payout.symbol = symbol;
                payout.pay = finalSymbolWin;
                payout.multiplier = multiplier;
                payout.offsets = iOffsets;
                payout.type = "ways";
                payout.wildIncluded = isWildSubstitude;
                payout.id = this.getWaysIndex(baseval, power, iOffsets);
                payoutDetails.push(payout);
            }
        });
        return payoutDetails;
    }
    getWaysIndex(baseval, power, offsets) {
        let index = 0;
        for (let i = 0; i < power; i++) {
            let row = 0;
            if (offsets.length > i) {
                row = offsets[i] / power;
            }
            if (row > 0) {
                const set = (Math.pow(baseval, (power - i - 1)));
                index += (set * row);
            }
        }
        return Math.floor(index + 1);
    }
    getSymbolList(grid, wildCollection) {
        const symbolList = new Set();
        grid[0].forEach(symbol => {
            symbolList.add(symbol);
        });
        return Array.from(symbolList);
    }
}
exports.WaysWinEvaluator = WaysWinEvaluator;
