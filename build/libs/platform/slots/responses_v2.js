"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigResponseV2Model = exports.PlayResponseV2Model = void 0;
const response_model_1 = require("../base/response_model");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class PlayResponseV2Model extends response_model_1.ResponseModel {
    constructor(version, name, math, state) {
        super(version, name, "");
        this.parseGameBets(state.gameStatus, math, state.buybonus);
        let spins = [];
        switch (state.gameStatus.action) {
            case "spin":
                spins = state.paidSpin;
                break;
            case "buybonus":
                spins = state.paidSpin;
                break;
            case "freespin":
                spins = state.freespins[state.freespins.length - 1];
                break;
            case "respin":
                spins = state.respins[state.respins.length - 1];
                break;
            case "freerespin":
                spins = state.freerespins[state.freerespins.length - 1];
                break;
            default: break;
        }
        this.parseGameState(state.gameStatus, spins, state.freespin);
        this.parseGameResult(spins, math.defaultgrid, state.cheatNums);
    }
    parseGameResult(spin, grid, cheats) {
        var _a;
        this.results = new GameV2ResultsResponse();
        this.results.cheats = cheats;
        this.results.reels = [];
        this.results.win = {};
        this.results.win.symbolWin = {};
        this.results.win.symbolWin.coins = 0;
        this.results.win.symbolWin.symbols = [];
        this.results.win.scatterWin = {};
        this.results.win.scatterWin.coins = 0;
        this.results.win.scatterWin.scatters = [];
        if (spin && spin.length > 0) {
            this.renderSpinGrid(spin[0].finalGrid, spin[0].initialGrid);
            this.results.win.total = spin[0].win;
            this.results.win.symbolWin.coins = spin[0].win;
            spin[0].wins.forEach(win => {
                const sym = { dir: "LEFT", smbID: win.symbol, lineID: win.id, amt: win.pay, num: win.offsets.length, mult: win.multiplier, offsets: win.offsets };
                sym["pos"] = win.offsets.map(offset => [offset % 5, Math.floor(offset / 5)]);
                this.results.win.symbolWin.symbols.push(sym);
            });
            (_a = spin[0].features) === null || _a === void 0 ? void 0 : _a.forEach(feature => {
                var _a;
                if (feature.isActive && feature.id == "freespin") {
                    this.results.win.scatterWin.scatters.push({
                        "smbID": feature.symbol, "amt": 0, "num": (_a = feature.offsets) === null || _a === void 0 ? void 0 : _a.length,
                        "bonusWon": "FREESPINS", "bonusWonValue": feature.count
                    });
                }
            });
            this.results.multipliers = spin[0].multipliers && spin[0].multipliers.length > 0 ? spin[0].multipliers : undefined;
        }
        else {
            this.renderSpinGrid(grid);
        }
    }
    renderSpinGrid(grid, prevGrid = null) {
        this.results.reels = [];
        for (let i = 0; i < grid.length; i++) {
            this.results.reels[i] = [];
            for (let j = 0; j < grid[i].length; j++) {
                this.results.reels[i][j] = { "smbID": grid[i][j] };
                if (prevGrid && prevGrid[i][j] != grid[i][j])
                    this.results.reels[i][j]["prevSmbID"] = prevGrid[i][j];
            }
        }
    }
    parseGameBets(state, math, buybonus) {
        this.bets = new GameV2BetResponse();
        this.bets.lines = math.info.payLines.length;
        this.bets.stake = new bignumber_js_1.default(state.totalBet).toNumber();
        this.bets.stakePerLine = new bignumber_js_1.default(state.stakeValue).toNumber();
        this.bets.buyIn = (buybonus === null || buybonus === void 0 ? void 0 : buybonus.isBonusSpin) ? true : false;
    }
    parseGameState(status, spin, feature) {
        var _a;
        this.state = new GameV2StateResponse();
        this.state.status = this.getGameStatus(status);
        this.state.totalWin = new bignumber_js_1.default(status.totalWin).toNumber();
        if (feature) {
            this.state.totalFSAwarded = feature.total;
            this.state.freespinsRemaining = feature.left;
            this.state.wonAdditionalSpins = feature.retrigger;
        }
        if (spin && spin.length > 0) {
            ;
            this.state.reelSet = spin[0].reelId;
            this.state.mult = spin[0].multiplier;
            this.state.preMult = spin[0].prevMultiplier;
            this.state.feature = [];
            (_a = spin[0].features) === null || _a === void 0 ? void 0 : _a.forEach(feature => {
                if (feature.isActive && feature.id !== "freespin")
                    this.state.feature.push(this.getFeaturesResponse(feature));
            });
        }
    }
    getGameStatus(status) {
        if ((status.action == "spin" || status.action == "buybonus") && status.nextAction[0] == "freespin") {
            return "FREESPINS_TRIGGER";
        }
        if ((status.action == "spin" || status.action == "buybonus") && status.nextAction[0] == "respin") {
            return "RESPINS_TRIGGER";
        }
        if (status.action == "respin") {
            return "RESPINS";
        }
        if (status.action == "freespin") {
            return "FREESPINS";
        }
        if (status.action == "freerespin") {
            return "FREERESPINS";
        }
        return "NORMAL";
    }
    getFeaturesResponse(feature) {
        switch (feature.id) {
            case "mystery":
                return this.getMysterySymbolResponse(feature);
            case "holdspin":
                return this.getHoldSpinResponse(feature);
        }
    }
    getHoldSpinResponse(feature) {
        return {
            featureName: "HOLD_SYMBOLS",
            offsets: feature.offsets
        };
    }
    getMysterySymbolResponse(feature) {
        return {
            featureName: "TRANSFORM_TO_SYMBOL",
            level: feature.level,
            transformTo: feature.symbol
        };
    }
}
exports.PlayResponseV2Model = PlayResponseV2Model;
class GameV2ResultsResponse {
}
class GameV2StateResponse {
    constructor() {
        this.preMult = 1;
        this.totalFSAwarded = 0;
        this.freespinsRemaining = 0;
        this.wonAdditionalSpins = 0;
        this.totalWin = 0;
        this.mult = 1;
        this.feature = null;
        this.hasCapped = false;
    }
}
class ConfigResponseV2Model extends PlayResponseV2Model {
    constructor(version, name, math, state) {
        var _a;
        super(version, name, math, state);
        const isReload = ((_a = state.gameStatus) === null || _a === void 0 ? void 0 : _a.nextAction) && !state.gameStatus.nextAction.includes("spin");
        this.parseGameConfigs(math, isReload);
    }
    parseGameConfigs(math, isReload) {
        this.config = new GameV2ConfigResponse();
        this.config.autoPlayValues = math.autoPlayValues;
        this.config.maxCoins = math.maxCoins;
        this.config.type = math.gameConfig.type;
        this.config.betValues = math.bets.map(bet => math.info.betMultiplier.multipliedBy((0, bignumber_js_1.default)(bet)).toNumber());
        this.config.defaultBetVal = math.info.betMultiplier.multipliedBy((0, bignumber_js_1.default)(math.defaultBet)).toNumber();
        this.config.freespins = math.gameConfig.freespins;
        this.config.numRows = math.info.gridLayout[0];
        this.config.numReels = math.info.gridLayout.length;
        this.config.payDirection = math.gameConfig.payDirection;
        this.config.coinsPlayed = math.info.betMultiplier.toNumber();
        this.config.disableBuyIn = math.gameConfig.disableBuyIn;
        this.config.isReload = isReload;
        this.config.lines = [];
        math.info.payLines.forEach(pl => this.config.lines.push(pl.join("")));
        if (math.buyBonus && math.buyBonus.length > 0) {
            this.config.buyBonus = new Map();
            math.buyBonus.forEach(bonus => {
                this.config.buyBonus[bonus.id] = bonus.cost;
            });
        }
        this.config.paytable = [];
        math.info.symbols.forEach(symbol => {
            const map = {};
            symbol.payout.forEach((pay, index) => {
                if (pay.isGreaterThan(new bignumber_js_1.default(0)))
                    map[index.toString()] = pay.toNumber();
            });
            const pay = { id: symbol.id, payout: map, name: symbol.name };
            pay[symbol.key] = true;
            this.config.paytable.push(pay);
        });
    }
}
exports.ConfigResponseV2Model = ConfigResponseV2Model;
class GameV2BetResponse {
    constructor() {
        this.stake = null;
        this.stakePerLine = null;
        this.balance = null;
        this.addBalance = 0;
        this.settle = false;
        this.buyIn = false;
    }
}
class GameV2ConfigResponse {
    constructor() {
        this.RTP = 0;
        this.buyInSetup = null;
        this.isReload = false;
    }
}
