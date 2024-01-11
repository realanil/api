"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGS = void 0;
var express = require("express");
var bignumber_js_1 = require("bignumber.js");
var uuid_1 = require("uuid");
var cors = require("cors");
var helmet = require("helmet");
var RGS = /** @class */ (function () {
    function RGS(gameServer) {
        var _this = this;
        this.states = new Map();
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet.contentSecurityPolicy({
            directives: {
                "default-src": ["'self'", '*'],
                blockAllMixedContent: []
            }
        }));
        this.server = gameServer;
        this.app.post('/:gameCode/config', function (req, res) {
            var gameCode = req.params.gameCode;
            var config = _this.server.config(null);
            config.sessionid = (0, uuid_1.v4)();
            if (_this.states.keys.length > 300) {
                Array.from(_this.states.keys())
                    .slice(0, 300 - _this.states.keys.length)
                    .forEach(function (key) { return _this.states.delete(key); });
            }
            _this.states.set(config.sessionid, null);
            res.send(config).status(200);
        });
        this.app.post('/:gameCode/play', function (req, res) {
            var gameCode = req.params.gameCode;
            var sessionid = req.body.sessionid;
            if (!_this.states.has(sessionid)) {
                res.send("invalid session id ".concat(sessionid)).status(200);
                return;
            }
            var state = _this.states.get(sessionid);
            var stake = req.body.stake ? new bignumber_js_1.default(req.body.stake) : new bignumber_js_1.default(0);
            var request = { action: req.body.action, stake: stake, cheat: req.body.cheat, state: state };
            var response = _this.server.play(request);
            if (response.state) {
                _this.states.set(sessionid, JSON.parse(JSON.stringify(response.state)));
            }
            res.send(response.response).status(200);
        });
    }
    RGS.prototype.start = function (port) {
        this.app.listen(port, function () {
            console.log("listening at port ".concat(port, " "));
        });
    };
    return RGS;
}());
exports.RGS = RGS;
