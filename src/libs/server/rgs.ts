import * as express from 'express';
import { Request, Response } from 'express';
import { BaseSlotGame } from '../platform/slots/base_slot_game';
import BigNumber from 'bignumber.js';
import { ServerResponseModel } from '../platform/slots/server_response_model';
import { v4 as uuidv4 } from 'uuid';
import * as cors from 'cors';

export class RGS {

    states: Map<string, any> = new Map();

    app: express.Application;
    server: BaseSlotGame

    constructor(gameServer: BaseSlotGame) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())


        this.server = gameServer;

        this.app.post('/:gameCode/config', (req: Request, res: Response) => {
            const gameCode = req.params.gameCode;
            const config: any = this.server.config(null);
            config.sessionid = uuidv4();

            if (this.states.keys.length > 300) {
                Array.from(this.states.keys())
                    .slice(0, 300 - this.states.keys.length)
                    .forEach(key => this.states.delete(key))
            }

            this.states.set(config.sessionid, null);
            res.send(config).status(200);
        });
        this.app.post('/:gameCode/play', (req: Request, res: Response) => {
            const gameCode = req.params.gameCode;
            const sessionid = req.body.sessionid;

            if (!this.states.has(sessionid)) {
                res.send(`invalid session id ${sessionid}`).status(200);
                return;
            }
            const state = this.states.get(sessionid);

            const stake: BigNumber = req.body.stake ? new BigNumber(req.body.stake) : new BigNumber(0);

            const request = { action: req.body.action, stake: stake, cheat: req.body.cheat, state };
            const response: ServerResponseModel = this.server.play(request);
            if (response.state) {
                this.states.set(sessionid, JSON.parse(JSON.stringify(response.state)));
            }
            res.send(response.response).status(200);
        });
    }

    start(port: string) {
        this.app.listen(port, () => {
            console.log(`listening at port ${port} `);
        });
    }

}