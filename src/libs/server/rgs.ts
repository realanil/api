import express from 'express';
import { Request, Response } from 'express';
import { BaseSlotGame } from '../platform/slots/base_slot_game';
import BigNumber from 'bignumber.js';
import { ServerResponseModel } from '../platform/slots/server_response_model';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

export class RGS {

    states: Map<string, any> = new Map();
    ids: Map<string, string> = new Map();
    balance: Map<string, BigNumber> = new Map();

    app: express.Application;
    servers: Map<string, BaseSlotGame>

    initial_balance: BigNumber;
    maximum_sessions: number;

    constructor(gameServers: Map<string, BaseSlotGame>) {
        this.initial_balance = process.env.INITIAL_BALANCE ? BigNumber(process.env.INITIAL_BALANCE) : BigNumber(1000);
        this.maximum_sessions = process.env.MAXIMUM_SESSIONS ? parseInt(process.env.MAXIMUM_SESSIONS) : 300;

        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())

        this.servers = gameServers;

        this.app.post('/:gameCode/config', (req: Request, res: Response) => {
            const gameCode = req.params.gameCode;

            let engine = this.servers.has(gameCode) ? this.servers.get(gameCode) : null;

            if (engine === null || engine === undefined) {
                res.send("invalid game code " + gameCode).status(404);
                return;
            }

            const config: any = engine.config(null);
            const player = req.body.player;
            if (player === null || player === undefined || player.length < 3 || player.length > 9) {
                res.send("invalid player " + player).status(401);
                return;
            }

            const code = `${player}-${gameCode}`
            const sessionId = this.ids.has(code) ? this.ids.get(code) : code+"-"+req.socket.remoteAddress+"-"+uuidv4();
            if (this.ids.has(code)) {
            } else {
                this.ids.set(code, sessionId);
                this.states.set(sessionId, null);
                this.balance.set(sessionId, BigNumber(this.initial_balance).plus(BigNumber(0)));
            }

            config.balance = this.balance.get(sessionId);

            if (this.states.keys.length > this.maximum_sessions) {
                Array.from(this.states.keys())
                    .slice(0, this.maximum_sessions - this.states.keys.length)
                    .forEach(key => this.states.delete(key))

                Array.from(this.ids.keys())
                    .slice(0, this.maximum_sessions - this.ids.keys.length)
                    .forEach(key => this.ids.delete(key))
            }
            res.setHeader("session", sessionId);
            res.send(config).status(200);
        });

        this.app.post('/:gameCode/play', (req: Request, res: Response) => {
            const gameCode = req.params.gameCode;
            const sessionid: string = req.header("session");

            const sessionDetails:string[] = sessionid.split("-");
            if (sessionDetails[1] !== gameCode ) {
                res.send(`session id not linked to the game`).status(500);
                return;
            }
            if (sessionDetails[2] !== req.socket.remoteAddress ) {
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

            const stake: BigNumber = req.body.stake ? new BigNumber(req.body.stake) : BigNumber(0);
            const cheat = process.env.CHEATS === "true" ? req.body.cheat : [];

            const request = { action: req.body.action, stake: stake, cheat: cheat, state, id: req.body.id };
            const response: ServerResponseModel | null = engine ? engine.play(request) : null;

            let balance = this.balance.has(sessionid) ? this.balance.get(sessionid) : null;
            if (response && response.state && balance) {
                balance = balance.minus(BigNumber(response.bet));
                if (balance.isLessThan(BigNumber(0))) {
                    res.send("Insufficient Funds").status(400);
                    return;
                }
                balance = balance.plus(BigNumber(response.win));

                this.states.set(sessionid, JSON.parse(JSON.stringify(response.state)));
                this.balance.set(sessionid, balance);

                response.response.balance = balance;
                res.send(response.response).status(200);
                return;
            }

            res.send("Internal Error").status(500);

        });
    }

    start(port: string) {
        this.app.listen(port, () => {
            console.log(`listening at port ${port} `);
        });
    }

}