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
exports.PlayResponseModel = void 0;
var bignumber_js_1 = require("bignumber.js");
var response_model_1 = require("../base/response_model");
var PlayResponseModel = /** @class */ (function (_super) {
    __extends(PlayResponseModel, _super);
    function PlayResponseModel(version, name, error, state) {
        var _this = _super.call(this, version, name, error) || this;
        _this.grid = [];
        _this.wins = [];
        _this.win = new bignumber_js_1.default(0);
        if (error !== null) {
            return _this;
        }
        _this.status = new StatusResponse();
        _this.status.action = state.gameStatus.action;
        _this.status.nextAction = state.gameStatus.nextAction;
        _this.status.totalBet = state.gameStatus.totalBet;
        _this.status.totalWin = state.gameStatus.totalWin;
        _this.grid = state.paidSpin[0].finalGrid;
        _this.win = state.paidSpin[0].win;
        _this.multiplier = state.paidSpin[0].multiplier;
        _this.wins = [];
        state.paidSpin[0].wins.forEach(function (win) {
            _this.wins.push(new PlaySlotWinsResponse(win.id, win.symbol, win.type, win.offsets, win.pay, win.wildIncluded));
        });
        if (state.freespin !== null && state.freespin !== undefined) {
            _this.feature = new FeatureResponse();
            _this.feature.left = state.freespin.left;
            _this.feature.total = state.freespin.total;
            _this.feature.accumulated = state.freespin.accumulated;
        }
        if (state.paidSpin.length > 1) {
            _this.subspins = [];
            var _loop_1 = function (i) {
                var subspin = new SubSpinResponse();
                subspin.grid = state.paidSpin[i].finalGrid;
                subspin.win = state.paidSpin[i].win;
                subspin.wins = [];
                state.paidSpin[i].wins.forEach(function (win) {
                    subspin.wins.push(new PlaySlotWinsResponse(win.id, win.symbol, win.type, win.offsets, win.pay, win.wildIncluded));
                });
                subspin.id = state.paidSpin[i].cascade.id;
                subspin.offsets = state.paidSpin[i].cascade.offsets;
                subspin.type = state.paidSpin[i].cascade.type;
                subspin.prevWin = state.paidSpin[i].cascade.win;
                subspin.multiplier = state.paidSpin[i].multiplier;
                this_1.subspins.push(subspin);
            };
            var this_1 = this;
            for (var i = 1; i < state.paidSpin.length; i++) {
                _loop_1(i);
            }
        }
        return _this;
    }
    return PlayResponseModel;
}(response_model_1.ResponseModel));
exports.PlayResponseModel = PlayResponseModel;
var StatusResponse = /** @class */ (function () {
    function StatusResponse() {
        this.nextAction = [];
    }
    return StatusResponse;
}());
var SubSpinResponse = /** @class */ (function () {
    function SubSpinResponse() {
        this.grid = [];
        this.wins = [];
        this.win = new bignumber_js_1.default(0);
        this.offsets = [];
        this.prevWin = new bignumber_js_1.default(0);
    }
    return SubSpinResponse;
}());
var FeatureResponse = /** @class */ (function () {
    function FeatureResponse() {
    }
    return FeatureResponse;
}());
var PlaySlotWinsResponse = /** @class */ (function () {
    function PlaySlotWinsResponse(id, symbol, type, offsets, pay, wildIncluded) {
        this.id = id;
        this.symbol = symbol;
        this.type = type;
        this.offsets = offsets;
        this.pay = new bignumber_js_1.default(0).plus(pay);
        this.wildIncluded = wildIncluded;
    }
    return PlaySlotWinsResponse;
}());
