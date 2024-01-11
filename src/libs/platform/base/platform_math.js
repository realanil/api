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
exports.PlatformMath = void 0;
var slot_math_model_1 = require("../../engine/slots/models/slot_math_model");
var PlatformMath = /** @class */ (function (_super) {
    __extends(PlatformMath, _super);
    function PlatformMath() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultBet = 1;
        _this.bets = [0.5, 1, 2, 5, 10];
        return _this;
    }
    return PlatformMath;
}(slot_math_model_1.SlotMath));
exports.PlatformMath = PlatformMath;
