import BigNumber from "bignumber.js";
import { SlotMath } from "../../engine/slots/models/slot_math_model";
import { ResponseModel } from "../base/response_model";
import { ServerResponseModel } from "./server_response_model";
import { PlayResponseModel } from "./play_response_model";
import { PlatformMath } from "../base/platform_math";

export class ConfigResponseModel extends ResponseModel {

    public betMultiplier: BigNumber;
    public paytable: SymbolsResponse[];
    public paylines: number[][];
    public defaultBet:number;
    public bets:number[];
    public grid:number[][];
    public prevSpin:ResponseModel;
    public buyBonus:Map<string, number>;

    constructor( version:string, name:string, math:PlatformMath, response:ResponseModel ){

        super(version, name, "");

        this.bets = math.bets;
        this.defaultBet = math.defaultBet;

        this.paytable = [];
        math.info.symbols.forEach( s => {
            this.paytable.push( new SymbolsResponse( s.name, s.id, s.payout ) );
        });

        this.betMultiplier = math.info.betMultiplier;

        this.paylines = [];
        math.info.payLines.forEach ( p => {
            this.paylines.push( p.slice() );
        });

        if (math.buyBonus && math.buyBonus.length > 0){
            this.buyBonus = new Map<string, number>();
            math.buyBonus.forEach( bonus => {
                this.buyBonus[bonus.id] = bonus.cost;
            });
        }

        if (response) {
            this.prevSpin = response;
        } else {
            this.grid = math.defaultgrid;
        }
        
    }
}


class SymbolsResponse {
    
    public name: string = "";
    public id: number = -1;
    public payout: BigNumber[] = [];
    
    constructor( name: string, id: number, payout: BigNumber[]) {
        this.name = name;
        this.id = id;
        this.payout = payout;
    }
}

