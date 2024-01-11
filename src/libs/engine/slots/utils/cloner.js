"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cloner = void 0;
var Cloner = /** @class */ (function () {
    function Cloner() {
    }
    Cloner.CloneGrid = function (target) {
        var grid = JSON.parse(JSON.stringify(target));
        return grid;
    };
    Cloner.CloneObject = function (target) {
        return JSON.parse(JSON.stringify(target));
    };
    return Cloner;
}());
exports.Cloner = Cloner;
