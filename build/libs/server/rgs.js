"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGS = void 0;
const express_1 = __importDefault(require("express"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
class RGS {
    constructor(gameServers) {
        this.states = new Map();
        this.ids = new Map();
        this.balance = new Map();
        this.initial_balance = process.env.INITIAL_BALANCE ? (0, bignumber_js_1.default)(process.env.INITIAL_BALANCE) : (0, bignumber_js_1.default)(1000);
        this.maximum_sessions = process.env.MAXIMUM_SESSIONS ? parseInt(process.env.MAXIMUM_SESSIONS) : 300;
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
        this.servers = gameServers;
        this.app.post('/:gameCode/config', (req, res) => {
            const gameCode = req.params.gameCode;
            let engine = this.servers.has(gameCode) ? this.servers.get(gameCode) : null;
            if (engine === null || engine === undefined) {
                res.send("invalid game code " + gameCode).status(404);
                return;
            }
            const config = engine.config(null);
            const player = req.body.player;
            if (player === null || player === undefined || player.length < 3 || player.length > 9) {
                res.send("invalid player " + player).status(401);
                return;
            }
            const code = `${player}-${gameCode}`;
            const sessionId = this.ids.has(code) ? this.ids.get(code) : code + "-" + req.socket.remoteAddress + "-" + (0, uuid_1.v4)();
            if (this.ids.has(code)) {
            }
            else {
                this.ids.set(code, sessionId);
                this.states.set(sessionId, null);
                this.balance.set(sessionId, (0, bignumber_js_1.default)(this.initial_balance).plus((0, bignumber_js_1.default)(0)));
            }
            config.balance = this.balance.get(sessionId);
            if (this.states.keys.length > this.maximum_sessions) {
                Array.from(this.states.keys())
                    .slice(0, this.maximum_sessions - this.states.keys.length)
                    .forEach(key => this.states.delete(key));
                Array.from(this.ids.keys())
                    .slice(0, this.maximum_sessions - this.ids.keys.length)
                    .forEach(key => this.ids.delete(key));
            }
            res.setHeader("session", sessionId);
            res.send(config).status(200);
        });
        this.app.post('/:gameCode/play', (req, res) => {
            const gameCode = req.params.gameCode;
            const sessionid = req.header("session");
            const sessionDetails = sessionid.split("-");
            if (sessionDetails[1] !== gameCode) {
                res.send(`session id not linked to the game`).status(500);
                return;
            }
            if (sessionDetails[2] !== req.socket.remoteAddress) {
                res.send(`session id not linked to the machine`).status(500);
                return;
            }
            if (!this.states.has(sessionid)) {
                res.send(`invalid session id ${sessionid}`).status(401);
                return;
            }
            const state = this.states.get(sessionid);
            const engine = this.servers.has(gameCode) ? this.servers.get(gameCode) : null;
            if (engine === null) {
                res.send("invalid game code " + gameCode).status(404);
                return;
            }
            const stake = req.body.stake ? new bignumber_js_1.default(req.body.stake) : (0, bignumber_js_1.default)(0);
            const cheat = process.env.CHEATS === "true" ? req.body.cheat : [];
            const request = { action: req.body.action, stake: stake, cheat: cheat, state, id: req.body.id };
            const response = engine ? engine.play(request) : null;
            let balance = this.balance.has(sessionid) ? this.balance.get(sessionid) : null;
            if (response && response.state && balance) {
                balance = balance.minus((0, bignumber_js_1.default)(response.bet));
                if (balance.isLessThan((0, bignumber_js_1.default)(0))) {
                    res.send("Insufficient Funds").status(400);
                    return;
                }
                balance = balance.plus((0, bignumber_js_1.default)(response.win));
                this.states.set(sessionid, JSON.parse(JSON.stringify(response.state)));
                this.balance.set(sessionid, balance);
                response.response.balance = balance;
                res.send(response.response).status(200);
                return;
            }
            res.send("Internal Error").status(500);
        });
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`listening at port ${port} `);
        });
    }
}
exports.RGS = RGS;
