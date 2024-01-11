import { IRandom, RandomObj } from "../../engine/generic/rng/random";
import { Cloner } from "../../engine/slots/utils/cloner";

export class NodeRNG implements IRandom {

    private cheat :number[] = [];
    private usedNums :number[] = [];

    getRandom(req :RandomObj) :RandomObj {
        const resp :RandomObj = new RandomObj( req.min, req.max, req.index );
        const num :number = this.cheat.length > 0 ? this.cheat.shift() : Math.floor(Math.random() * (req.max - req.min)) + req.min;
        resp.num = num;
        if (process.env.NODE_ENV === "dev" ) {
            this.usedNums.push( num);
        }
        return resp;
    }

    getRandoms(req :RandomObj[]) :RandomObj[] {
        const resp :RandomObj[] = [];
        req.forEach(e => {
            resp.push( this.getRandom(e) );
        });
        return resp;
    }

    getAndResetUsedNums() :number[] {
        const nums = Cloner.CloneObject( this.usedNums);
        this.usedNums = []; 
        return nums;
    }

    setCheat( cheat :number[] ){ 
        if (process.env.CHEATS === "true") {
            this.cheat = [];
            if (cheat === null || cheat === undefined || cheat.length === 0) {
                return;
            }
            this.cheat = cheat;
        }
    }
    
}