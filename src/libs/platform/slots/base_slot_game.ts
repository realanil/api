import BigNumber from "bignumber.js";
import { BuyBonusDetails, SlotState } from "../../engine/slots/models/slot_state_model";
import { NodeRNG } from "../base/node_rng";
import { PlatformMath } from "../base/platform_math";
import { ResponseModel } from "../base/response_model";
import { ConfigResponseModel } from "./config_response_model";
import { PlayResponseModel } from "./play_response_model";
import { RequestModel } from "./request_model";
import { ServerResponseModel } from "./server_response_model";

export class BaseSlotGame {

    protected name: string;
    protected version: string;
   
    protected math: PlatformMath;
    protected state: SlotState;
    protected rng: NodeRNG;

    constructor( name:string, version:string ) {
        this.name = name;
        this.version = version;
        
        this.rng = new NodeRNG();
        this.state = this.defaultEmptyState();
    }

    public config( state:SlotState): ResponseModel {
        let response:ResponseModel = null;
        if (state && state.gameStatus && state.gameStatus.action !== "" && !state.gameStatus.nextAction.includes("spin")) {
            response = this.getPlayResponse();
        }
        return this.getConfigResponse( response);
    }

    public play( request: RequestModel ): ServerResponseModel {
        
        const playerAction:string = ( request.action === "buybonus") ? "spin" : request.action;
        
        this.state = request.state;
        const response:ServerResponseModel = new ServerResponseModel();
        response.bet = 0;
        response.win = 0;

        if ( this.state && this.state.gameStatus && this.state.gameStatus.nextAction ) {
            if ( !this.state.gameStatus.nextAction.includes( playerAction)){
                response.state = this.state;
                response.response = new PlayResponseModel( this.version, this.name, `Wrong Action. Expected ${this.state.gameStatus.nextAction} Got ${request.action}`, this.state);
                return response
            }
        } else {
            if ( playerAction !== "spin") {
                response.state = this.state;
                response.response = new PlayResponseModel( this.version, this.name, "Action not allowed", this.state);
                return response
            }
        }

        if ( playerAction === "spin" ){
            const stake :BigNumber = request.stake.dividedBy( this.math.info.betMultiplier );
            if ( !this.math.bets.includes( stake.toNumber() ) ) {
                response.response = new PlayResponseModel( this.version, this.name, `Invalid Stake. Got ${request.stake}`, this.state);
                return response;
            }

            this.state = this.defaultEmptyState();
            if (request.action === "buybonus") {
                this.parseBuyBonus( request);
                if (this.state.error) {
                    response.response = new PlayResponseModel( this.version, this.name, this.state.error, this.state);
                    return response;
                }
            }

            this.state.gameStatus.stakeValue = stake;
            this.state.gameStatus.totalBet = request.stake;
            if (this.state.buybonus) {
                this.state.gameStatus.totalBet = this.state.gameStatus.totalBet.multipliedBy( this.state.buybonus.cost );
            }
            response.bet = this.state.gameStatus.totalBet.toNumber() ;
        }
        this.state.error = null;

        this.state.gameStatus.action = request.action;
        this.rng.setCheat( request.cheat );
        this.executePlay( request.action );

        // this.state.cheatNums = this.rng.getAndResetUsedNums();
        if (this.state.gameStatus.nextAction.includes('spin') ) {
            this.state.cheatNums = this.rng.getAndResetUsedNums();
            response.win = new BigNumber(this.state.gameStatus.totalWin).toNumber();
        }
        response.state = this.state;
        response.response = this.getPlayResponse();
        
        return response;
    }

    parseBuyBonus( request:RequestModel) {
        this.state.buybonus = null;

        if( this.math.buyBonus === null || this.math.buyBonus === undefined || this.math.buyBonus.length === 0 ){
            this.state.error = "Buy Bonus not available in this game";
            return;
        }
        
        this.math.buyBonus.forEach( bonus => {
            if ( bonus.id === request.id ) {
                this.state.buybonus = new BuyBonusDetails();
                this.state.buybonus.isBonusSpin = true;
                this.state.buybonus.cost = new BigNumber( bonus.cost);
                this.state.buybonus.id = bonus.id;
            }
        })

        if (!this.state.buybonus){
            this.state.error = "Buy Bonus id not found";
            return;
        }
        
    }

    protected getPlayResponse():ResponseModel {
        return new PlayResponseModel( this.version, this.name, this.state.error, this.state);
    }

    protected getConfigResponse( response:ResponseModel):ResponseModel {
        return new ConfigResponseModel( this.version, this.name, this.math, response);
    }

    protected executePlay( action:string) {
        switch(action) {
            case "spin": 
                this.executeBaseSpin();
                break;
            case "freespin": 
                this.state.freespin.retrigger = 0;
                this.executeFreeSpin();
                break;
            case "respin": 
                this.state.respin.retrigger = 0;
                this.executeReSpin();
                break;
            case "freerespin": 
                this.state.freerespin.retrigger = 0;
                this.executeFreeReSpin();
                break;                
            case "collect":
                this.executeCollect();
                break;
            case "buybonus":
                this.executeBuyBonus();
                break;
            default:
                this.state.error = "Not Allowed"; 
        }
    }

    protected executeBaseSpin() {
        this.state.error = "Not Allowed";
    }
    protected executeFreeSpin() {
        this.state.error = "Not Allowed";
    }
    protected executeCollect() {
        this.state.error = "Not Allowed";
    }
    protected executeFreeReSpin() {
        this.state.error = "Not Allowed";
    }
    protected executeReSpin() {
        this.state.error = "Not Allowed";
    }
    protected executeBuyBonus() {
        this.state.error = "Not Allowed";
    }
    
    protected defaultEmptyState(): SlotState{
        return new SlotState()
    }

}