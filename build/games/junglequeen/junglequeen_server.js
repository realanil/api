"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const base_slot_game_1 = require("../../libs/platform/slots/base_slot_game");
const slot_state_model_1 = require("../../libs/engine/slots/models/slot_state_model");
const create_grid_1 = require("../../libs/engine/slots/actions/create_grid");
const cloner_1 = require("../../libs/engine/slots/utils/cloner");
const calculate_wins_1 = require("../../libs/engine/slots/actions/calculate_wins");
const junglequeen_response_1 = require("./models/junglequeen_response");
const junglequeen_state_1 = require("./models/junglequeen_state");
const junglequeen_math_1 = require("./models/junglequeen_math");
const create_stops_1 = require("../../libs/engine/slots/actions/create_stops");
const evaluate_wins_1 = require("../../libs/engine/slots/actions/evaluate_wins");
const random_1 = require("../../libs/engine/slots/utils/random");
const random_condition_1 = require("../../libs/engine/slots/conditions/random_condition");
const grid_1 = require("../../libs/engine/slots/utils/grid");
const CustomWins_1 = require("./evaluate/CustomWins");
const responses_v2_1 = require("../../libs/platform/slots/responses_v2");
const scatter_symbol_count_1 = require("../../libs/engine/slots/conditions/scatter_symbol_count");
const triggerer_1 = require("../../libs/engine/slots/features/triggerer");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const update_feature_1 = require("../../libs/engine/slots/features/update_feature");
const random_2 = require("../../libs/engine/generic/rng/random");
const slot_math_model_1 = require("../../libs/engine/slots/models/slot_math_model");
class GameServer extends base_slot_game_1.BaseSlotGame {
    constructor() {
        super("JungleQueen", "0.5");
        this.math = new junglequeen_math_1.JungleQueenMath();
    }
    executeBaseSpin() {
        // check for mystery feature 
        const useMysteryReels = random_condition_1.RandomCondition.IsAvailable(this.math.conditions["UseMysteryReels"], this.rng);
        let spinState = null;
        if (useMysteryReels.isActive) {
            spinState = this.executeMysteryBaseSpin(useMysteryReels);
        }
        else {
            spinState = this.executeNonMysteryBaseSpin();
            let random = this.rng.getRandom(new random_2.RandomObj(0, 10, 1)).num;
            while (!spinState.win.isZero() && spinState.win.isLessThan(this.state.gameStatus.totalBet) && random < 6) {
                spinState = this.executeNonMysteryBaseSpin();
                random = this.rng.getRandom(new random_2.RandomObj(0, 10, 1)).num;
            }
        }
        this.state.gameStatus.currentWin = spinState.win;
        this.state.gameStatus.totalWin = spinState.win;
        this.state.paidSpin = [spinState];
    }
    executeMysteryBaseSpin(mystery) {
        let state = new slot_state_model_1.SlotSpinState();
        const jqMath = this.math;
        const selectedSet = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.paidFeatureReels);
        state.reelId = selectedSet.id;
        state.stops = create_stops_1.CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout);
        state.initialGrid = create_grid_1.CreateGrid.StandardGrid(selectedSet.reels, state.stops);
        state.finalGrid = cloner_1.Cloner.CloneGrid(state.initialGrid);
        state.features = [];
        const level = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.actions["BaseGameLevels"].feature);
        state.finalGrid = grid_1.Grid.ReplaceSymbolsInGrid(level.symbols, state.finalGrid, jqMath.mystrySymbolId);
        mystery.level = level.id;
        mystery.offsets = grid_1.Grid.FindScatterOffsets(jqMath.mystrySymbolId, state.finalGrid);
        const mystrySymbols = this.math.actions["BaseLevelsMystery"].features[level.id - 1];
        const selectedSymbol = random_1.RandomHelper.GetRandomFromList(this.rng, mystrySymbols);
        mystery.symbol = selectedSymbol.symbols[0];
        state.finalGrid = grid_1.Grid.ReplaceSymbolsInGrid([jqMath.mystrySymbolId], state.finalGrid, mystery.symbol);
        state.wins = evaluate_wins_1.EvaluateWins.LineWins(this.math.info, state.finalGrid, this.state.gameStatus.stakeValue);
        state.wins = state.wins.concat(CustomWins_1.CustomWins.EvaluateGoldWin(this.rng, this.math, state.finalGrid, this.state.gameStatus.totalBet));
        state.win = calculate_wins_1.CalculateWins.AddPays(state.wins);
        if (state.win < this.state.gameStatus.stakeValue && this.rng.getRandom(new random_2.RandomObj(0, 10, 1)).num < 7) {
            mystery.offsets = grid_1.Grid.FindScatterOffsets(this.math.conditions["UseMysteryReels"].symbol, state.initialGrid);
            const mysterySymbol = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.actions["BaseMysteryOnly"].feature);
            mystery.level = "R";
            mystery.symbol = mysterySymbol.symbols[0];
            state.finalGrid = grid_1.Grid.ReplaceSymbolsInOffsets(mystery.offsets, state.initialGrid, mystery.symbol);
            state.wins = evaluate_wins_1.EvaluateWins.LineWins(this.math.info, state.finalGrid, this.state.gameStatus.stakeValue);
            state.win = calculate_wins_1.CalculateWins.AddPays(state.wins);
        }
        state.features = [mystery];
        return state;
    }
    executeNonMysteryBaseSpin() {
        let state = new slot_state_model_1.SlotSpinState();
        const selectedSet = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.paidReels);
        state.reelId = selectedSet.id;
        state.stops = create_stops_1.CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout);
        state.initialGrid = create_grid_1.CreateGrid.StandardGrid(selectedSet.reels, state.stops);
        state.finalGrid = cloner_1.Cloner.CloneGrid(state.initialGrid);
        state.wins = evaluate_wins_1.EvaluateWins.LineWins(this.math.info, state.finalGrid, this.state.gameStatus.stakeValue);
        state.win = calculate_wins_1.CalculateWins.AddPays(state.wins);
        this.state.freespin = new slot_state_model_1.FeatureDetails();
        this.state.gameStatus.nextAction = ["spin"];
        const freespins = scatter_symbol_count_1.ScatterSymbolCount.checkCondition(this.math.conditions["FreespinTrigger"], state);
        if (freespins.isActive) {
            triggerer_1.Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinTrigger"]);
            triggerer_1.Triggerer.UpdateNextAction(this.state, this.math.actions["FreespinTrigger"]);
            const jqState = this.state;
            jqState.mystrySymbolCount = 0;
            jqState.mystryLevel = 0;
            jqState.multiplier = 1;
        }
        state.features = [freespins];
        return state;
    }
    executeBuyBonus() {
        let state = new slot_state_model_1.SlotSpinState();
        const bbAward = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.collection["BuyBonusAward"]);
        const condition = new slot_math_model_1.SlotConditionMath();
        condition.oak = [bbAward.count];
        condition.symbol = 12;
        const selectedSet = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.paidReels);
        state.reelId = selectedSet.id;
        state.stops = create_stops_1.CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout);
        state.initialGrid = create_grid_1.CreateGrid.StandardGrid(selectedSet.reels, state.stops);
        state.finalGrid = cloner_1.Cloner.CloneGrid(state.initialGrid);
        state.wins = evaluate_wins_1.EvaluateWins.LineWins(this.math.info, state.finalGrid, this.state.gameStatus.stakeValue);
        state.win = calculate_wins_1.CalculateWins.AddPays(state.wins);
        let feature = scatter_symbol_count_1.ScatterSymbolCount.checkCondition(this.math.conditions["FreespinTrigger"], state);
        while (!feature.isActive || state.win.isGreaterThan(0)) {
            state.stops = create_stops_1.CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout);
            state.initialGrid = create_grid_1.CreateGrid.StandardGrid(selectedSet.reels, state.stops);
            state.finalGrid = cloner_1.Cloner.CloneGrid(state.initialGrid);
            state.wins = evaluate_wins_1.EvaluateWins.LineWins(this.math.info, state.finalGrid, this.state.gameStatus.stakeValue);
            state.win = calculate_wins_1.CalculateWins.AddPays(state.wins);
            feature = scatter_symbol_count_1.ScatterSymbolCount.checkCondition(this.math.conditions["FreespinTrigger"], state);
        }
        if (feature.isActive) {
            triggerer_1.Triggerer.UpdateFeature(this.state, feature, this.math.actions["FreespinTrigger"]);
            triggerer_1.Triggerer.UpdateNextAction(this.state, this.math.actions["FreespinTrigger"]);
            const jqState = this.state;
            jqState.mystrySymbolCount = 0;
            jqState.mystryLevel = 0;
            jqState.multiplier = 1;
        }
        state.features = [feature];
        this.state.paidSpin = [state];
    }
    executeFreeSpin() {
        let state = new slot_state_model_1.SlotSpinState();
        const jqState = this.state;
        const jqMath = this.math;
        const selectedSet = random_1.RandomHelper.GetRandomFromList(this.rng, this.math.freeReels);
        state.reelId = selectedSet.id;
        state.stops = create_stops_1.CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout);
        state.initialGrid = create_grid_1.CreateGrid.StandardGrid(selectedSet.reels, state.stops);
        const symbolsToMystery = this.math.actions["FreeLevelsMystery"].feature[jqState.mystryLevel].symbols;
        state.finalGrid = grid_1.Grid.ReplaceSymbolsInGrid(symbolsToMystery, state.initialGrid, jqMath.mystrySymbolId);
        const mystrySymbols = this.math.actions["FreeLevelsMystery"].features[jqState.mystryLevel];
        const selectedSymbol = random_1.RandomHelper.GetRandomFromList(this.rng, mystrySymbols);
        state.features = [];
        const mystery = scatter_symbol_count_1.ScatterSymbolCount.checkCondition(this.math.conditions["MysteryTrigger"], state);
        if (mystery.isActive) {
            jqState.mystrySymbolCount += mystery.offsets.length;
            let mystLevel = this.math.collection["FreeSpinLevelcondition"].find(coll => jqState.mystrySymbolCount >= coll.from && jqState.mystrySymbolCount < coll.to);
            if (mystLevel === undefined || mystLevel === null) {
                mystLevel = this.math.collection["FreeSpinLevelcondition"].find(coll => jqState.mystrySymbolCount >= coll.from && coll.to === -1);
            }
            mystery.level = mystLevel.level;
            const level = parseInt(mystery.level);
            if (level !== jqState.mystryLevel) {
                const diff = level - jqState.mystryLevel;
                jqState.mystryLevel = level;
                jqState.multiplier += diff;
                const action = this.math.actions["FreespinReTrigger"];
                mystery.triggers = action.triggers;
                mystery.count = action.spins * diff;
                this.state.freespin.left += mystery.count;
                this.state.freespin.total += mystery.count;
                this.state.freespin.retrigger = mystery.count;
            }
        }
        state.features.push(mystery);
        mystery.symbol = selectedSymbol.symbols[0];
        state.finalGrid = grid_1.Grid.ReplaceSymbolsInGrid([jqMath.mystrySymbolId], state.finalGrid, mystery.symbol);
        state.multiplier = jqState.multiplier;
        state.wins = evaluate_wins_1.EvaluateWins.LineWins(this.math.info, state.finalGrid, this.state.gameStatus.stakeValue);
        const totalBet = new bignumber_js_1.default(this.state.gameStatus.stakeValue).multipliedBy(this.math.info.betMultiplier);
        const goldWins = CustomWins_1.CustomWins.EvaluateGoldWin(this.rng, jqMath, state.finalGrid, totalBet);
        state.wins = state.wins.concat(goldWins);
        state.win = calculate_wins_1.CalculateWins.AddPays(state.wins).multipliedBy(state.multiplier);
        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = new bignumber_js_1.default(this.state.gameStatus.totalWin).plus(state.win);
        this.state.freespin.accumulated = new bignumber_js_1.default(this.state.freespin.accumulated).plus(state.win);
        update_feature_1.UpdateFeature.updateFreeSpinCount(this.state);
        this.state.freespins.push([state]);
    }
    getPlayResponse() {
        return new junglequeen_response_1.JungleQueenResponseModel(this.version, this.name, this.math, this.state);
    }
    getConfigResponse(response) {
        return new responses_v2_1.ConfigResponseV2Model(this.version, this.name, this.math, this.state);
    }
    defaultEmptyState() {
        return new junglequeen_state_1.JungleQueenState();
    }
}
exports.GameServer = GameServer;
