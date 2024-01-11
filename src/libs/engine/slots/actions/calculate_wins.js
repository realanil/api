"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateWins = void 0;
var bignumber_js_1 = require("bignumber.js");
var CalculateWins = /** @class */ (function () {
    function CalculateWins() {
    }
    CalculateWins.AddPays = function (wins) {
        var pay = new bignumber_js_1.default(0);
        wins.forEach(function (win) {
            pay = pay.plus(win.pay);
        });
        return pay;
    };
    return CalculateWins;
}());
exports.CalculateWins = CalculateWins;
