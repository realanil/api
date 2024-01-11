import { IRandom, RandomObj } from "../../engine/generic/rng/Random";
import { Cloner } from "../../engine/slots/utils/cloner";

export class NodeRNG implements IRandom {

    private cheat :number[] = [];

    getRandom(req :RandomObj) :RandomObj {
        const resp :RandomObj = new RandomObj( req.min, req.max, req.index );
        const num :number = this.cheat.length > 0 ? this.cheat.shift() : Math.floor(Math.random() * (req.max - req.min)) + req.min;
        resp.num = num;
        return resp;
    }

    getRandoms(req :RandomObj[]) :RandomObj[] {
        const resp :RandomObj[] = [];
        req.forEach(e => {
            resp.push( this.getRandom(e) );
        });
        return resp;
    }

    setCheat( cheat :number[] ){
        this.cheat = [];
        if (cheat === null || cheat === undefined || cheat.length === 0) {
            return;
        }
        this.cheat = cheat;
    }
    
}