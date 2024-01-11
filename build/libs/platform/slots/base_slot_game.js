"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSlotGame = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const slot_state_model_1 = require("../../engine/slots/models/slot_state_model");
const node_rng_1 = require("../base/node_rng");
const config_response_model_1 = require("./config_response_model");
const play_response_model_1 = require("./play_response_model");
const server_response_model_1 = require("./server_response_model");
class BaseSlotGame {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.rng = new node_rng_1.NodeRNG();
        this.state = this.defaultEmptyState();
    }
    config(state) {
        let response = null;
        if (state && state.gameStatus && state.gameStatus.action !== "" && !state.gameStatus.nextAction.includes("spin")) {
            response = this.getPlayResponse();
        }
        return this.getConfigResponse(response);
    }
    play(request) {
        const playerAction = (request.action === "buybonus") ? "spin" : request.action;
        this.state = request.state;
        const response = new server_response_model_1.ServerResponseModel();
        response.bet = 0;
        response.win = 0;
        if (this.state && this.state.gameStatus && this.state.gameStatus.nextAction) {
            if (!this.state.gameStatus.nextAction.includes(playerAction)) {
                response.state = this.state;
                response.response = new play_response_model_1.PlayResponseModel(this.version, this.name, `Wrong Action. Expected ${this.state.gameStatus.nextAction} Got ${request.action}`, this.state);
                return response;
            }
        }
        else {
            if (playerAction !== "spin") {
                response.state = this.state;
                response.response = new play_response_model_1.PlayResponseModel(this.version, this.name, "Action not allowed", this.state);
                return response;
            }
        }
        if (playerAction === "spin") {
            const stake = request.stake.dividedBy(this.math.info.betMultiplier);
            if (!this.math.bets.includes(stake.toNumber())) {
                response.response = new play_response_model_1.PlayResponseModel(this.version, this.name, `Invalid Stake. Got ${request.stake}`, this.state);
                return response;
            }
            this.state = this.defaultEmptyState();
            if (request.action === "buybonus") {
                this.parseBuyBonus(request);
                if (this.state.error) {
                    response.response = new play_response_model_1.PlayResponseModel(this.version, this.name, this.state.error, this.state);
                    return response;
                }
            }
            this.state.gameStatus.stakeValue = stake;
            this.state.gameStatus.totalBet = request.stake;
            if (this.state.buybonus) {
                this.state.gameStatus.totalBet = this.state.gameStatus.totalBet.multipliedBy(this.state.buybonus.cost);
            }
            response.bet = this.state.gameStatus.totalBet.toNumber();
        }
        this.state.error = null;
        this.state.gameStatus.action = request.action;
        this.rng.setCheat(request.cheat);
        this.executePlay(request.action);
        // this.state.cheatNums = this.rng.getAndResetUsedNums();
        if (this.state.gameStatus.nextAction.includes('spin')) {
            this.state.cheatNums = this.rng.getAndResetUsedNums();
            response.win = new bignumber_js_1.default(this.state.gameStatus.totalWin).toNumber();
        }
        response.state = this.state;
        response.response = this.getPlayResponse();
        return response;
    }
    parseBuyBonus(request) {
        this.state.buybonus = null;
        if (this.math.buyBonus === null || this.math.buyBonus === undefined || this.math.buyBonus.length === 0) {
            this.state.error = "Buy Bonus not available in this game";
            return;
        }
        this.math.buyBonus.forEach(bonus => {
            if (bonus.id === request.id) {
                this.state.buybonus = new slot_state_model_1.BuyBonusDetails();
                this.state.buybonus.isBonusSpin = true;
                this.state.buybonus.cost = new bignumber_js_1.default(bonus.cost);
                this.state.buybonus.id = bonus.id;
            }
        });
        if (!this.state.buybonus) {
            this.state.error = "Buy Bonus id not found";
            return;
        }
    }
    getPlayResponse() {
        return new play_response_model_1.PlayResponseModel(this.version, this.name, this.state.error, this.state);
    }
    getConfigResponse(response) {
        return new config_response_model_1.ConfigResponseModel(this.version, this.name, this.math, response);
    }
    executePlay(action) {
        switch (action) {
            case "spin":
                this.executeBaseSpin();
                break;
            case "freespin":
                this.state.freespin.retrigger = 0;
                this.executeFreeSpin();
                break;
            case "respin":
                this.state.respin.retrigger = 0;
                this.executeReSpin();
                break;
            case "freerespin":
                this.state.freerespin.retrigger = 0;
                this.executeFreeReSpin();
                break;
            case "collect":
                this.executeCollect();
                break;
            case "buybonus":
                this.executeBuyBonus();
                break;
            default:
                this.state.error = "Not Allowed";
        }
    }
    executeBaseSpin() {
        this.state.error = "Not Allowed";
    }
    executeFreeSpin() {
        this.state.error = "Not Allowed";
    }
    executeCollect() {
        this.state.error = "Not Allowed";
    }
    executeFreeReSpin() {
        this.state.error = "Not Allowed";
    }
    executeReSpin() {
        this.state.error = "Not Allowed";
    }
    executeBuyBonus() {
        this.state.error = "Not Allowed";
    }
    defaultEmptyState() {
        return new slot_state_model_1.SlotState();
    }
}
exports.BaseSlotGame = BaseSlotGame;
