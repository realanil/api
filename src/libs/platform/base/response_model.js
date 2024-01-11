"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
var ResponseModel = /** @class */ (function () {
    function ResponseModel(version, name, error) {
        this.name = name;
        this.version = version;
        this.error = error;
    }
    return ResponseModel;
}());
exports.ResponseModel = ResponseModel;
