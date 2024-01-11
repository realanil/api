"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigResponseModel = void 0;
var response_model_1 = require("../base/response_model");
var ConfigResponseModel = /** @class */ (function (_super) {
    __extends(ConfigResponseModel, _super);
    function ConfigResponseModel(version, name, math, response) {
        var _this = _super.call(this, version, name, "") || this;
        _this.bets = math.bets;
        _this.defaultBet = math.defaultBet;
        _this.paytable = [];
        math.info.symbols.forEach(function (s) {
            _this.paytable.push(new SymbolsResponse(s.name, s.id, s.payout));
        });
        _this.betMultiplier = math.info.betMultiplier;
        _this.paylines = [];
        math.info.payLines.forEach(function (p) {
            _this.paylines.push(p.slice());
        });
        if (response) {
            _this.prevSpin = response;
        }
        else {
            _this.grid = math.defaultgrid;
        }
        return _this;
    }
    return ConfigResponseModel;
}(response_model_1.ResponseModel));
exports.ConfigResponseModel = ConfigResponseModel;
var SymbolsResponse = /** @class */ (function () {
    function SymbolsResponse(name, id, payout) {
        this.name = "";
        this.id = -1;
        this.payout = [];
        this.name = name;
        this.id = id;
        this.payout = payout;
    }
    return SymbolsResponse;
}());
