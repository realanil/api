import { SlotMath } from "../../engine/slots/models/slot_math_model";
import { SlotState } from "../../engine/slots/models/slot_state_model";
import { NodeRNG } from "../base/node_rng";
import { PlatformMath } from "../base/platform_math";
import { ConfigResponseModel } from "./config_response_model";
import { PlayResponseModel } from "./play_response_model";
import { RequestModel } from "./request_model";
import { ServerResponseModel } from "./server_response_model";

export class BaseSlotGame {

    protected name : string;
    protected version : string;
   
    protected math : PlatformMath;
    protected state : SlotState;
    protected rng : NodeRNG;

    constructor( name:string, version:string ) {
        this.name = name;
        this.version = version;
        
        this.rng = new NodeRNG();
        this.state = new SlotState();
    }

    public config( state :SlotState) : ConfigResponseModel {
        let response :PlayResponseModel = null;
        if (state && state.gameStatus && state.gameStatus.action !== "" && !state.gameStatus.nextAction.includes("spin")) {
            response = new PlayResponseModel( this.version, this.name, this.state.error, this.state);
        }
        return new ConfigResponseModel( this.version, this.name, this.math, response);
    }

    public play( request : RequestModel ) : ServerResponseModel {
        
        this.state = request.state;
        const response :ServerResponseModel = new ServerResponseModel();
        if ( this.state && this.state.gameStatus && this.state.gameStatus.nextAction ) {
            if ( !this.state.gameStatus.nextAction.includes( request.action)){
                response.state = this.state;
                response.response = new PlayResponseModel( this.version, this.name, `Wrong Action. Expected ${this.state.gameStatus.nextAction} Got ${request.action}`, this.state);
                return response
            }
        } else {
            if ( request.action !== "spin") {
                response.state = this.state;
                response.response = new PlayResponseModel( this.version, this.name, "Action not allowed", this.state);
                return response
            }
        }

        if ( request.action === "spin" ){
            if ( !this.math.bets.includes( request.stake.toNumber() ) ) {
                response.response = new PlayResponseModel( this.version, this.name, `Invalid Stake. Got ${request.stake}`, this.state);
                return response;
            }

            this.state = this.defaultEmptyState();
            this.state.gameStatus.stakeValue = request.stake;
            this.state.gameStatus.totalBet = request.stake.multipliedBy( this.math.info.betMultiplier);
        }
        this.state.error = null;

        
        
        this.state.gameStatus.action = request.action;
        this.rng.setCheat( request.cheat );
        this.executePlay( request.action );

        response.state = this.state;
        response.response = this.getPlayResponse();
        return response;
    }

    protected getPlayResponse() :PlayResponseModel {
        return new PlayResponseModel( this.version, this.name, this.state.error, this.state);
    }

    protected executePlay( action:string) {
        switch(action) {
            case "spin": 
                this.executeBaseSpin();
                break;
            case "freespin": 
                this.executeFreeSpin();
                break;
            case "collect":
                this.executeCollect();
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

    protected defaultEmptyState() : SlotState{
        return new SlotState()
    }

}