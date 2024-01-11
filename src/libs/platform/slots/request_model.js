"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = void 0;
var bignumber_js_1 = require("bignumber.js");
var RequestModel = /** @class */ (function () {
    function RequestModel() {
        this.action = "";
        this.stake = new bignumber_js_1.default(0);
    }
    return RequestModel;
}());
exports.RequestModel = RequestModel;
