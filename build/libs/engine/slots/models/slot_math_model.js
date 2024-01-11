"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotActionMath = exports.SlotConditionMath = exports.IsAvailable = exports.WeightedSymbols = exports.SlotInfoMath = exports.SlotMath = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class SlotMath {
    constructor() {
        this.info = new SlotInfoMath();
        this.paidReels = [];
        this.freeReels = [];
        this.reSpinReels = [];
        this.freeReSpinReels = [];
        this.paidFeatureReels = [];
        this.conditions = new Map();
        this.collection = new Map();
        this.actions = new Map();
        this.defaultgrid = [];
        this.buyBonus = [];
    }
    bd(v) { return new bignumber_js_1.default(v); }
}
exports.SlotMath = SlotMath;
class BuyBonusMath {
}
class SlotCollectionMath {
}
class SlotInfoMath {
    constructor() {
        this.betMultiplier = new bignumber_js_1.default(0);
        this.gridLayout = [];
        this.wildSymbols = [];
        this.payLines = [];
        this.symbols = [];
    }
}
exports.SlotInfoMath = SlotInfoMath;
class SlotSymbolsMath {
    constructor() {
        this.payout = [];
        this.name = "";
        this.id = -1;
    }
}
class SlotReelsMath {
    constructor() {
        this.id = "";
        this.reels = [];
        this.symbols = [];
        this.weight = -1;
    }
}
class WeightedSymbols {
    constructor() {
        this.symbol = -1;
        this.weight = -1;
    }
}
exports.WeightedSymbols = WeightedSymbols;
class IsAvailable {
    constructor() {
        this.available = false;
        this.weight = -1;
    }
}
exports.IsAvailable = IsAvailable;
class SlotConditionMath {
    constructor() {
        this.symbol = -1;
        this.id = null;
        this.oak = null;
        this.minCount = -1;
        this.maxCount = -1;
    }
}
exports.SlotConditionMath = SlotConditionMath;
class SlotActionMath {
    constructor() {
        this.payout = new bignumber_js_1.default(0);
        this.triggers = [];
        this.spins = -1;
        this.features = null;
        this.feature = null;
        this.id = null;
    }
}
exports.SlotActionMath = SlotActionMath;
class SlotFeatureMath {
    constructor() {
        this.weight = 0;
    }
}
