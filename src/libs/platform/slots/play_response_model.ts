import BigNumber from "bignumber.js";
import { SlotState } from "../../engine/slots/models/slot_state_model";
import { ResponseModel } from "../base/response_model";

export class PlayResponseModel extends ResponseModel {

    public reelId :string = null;
    public grid :number[][] = [];
    public initialGrid :number[][] = [];
    public multiplier :number;
    public wins :PlaySlotWinsResponse[] = []; 
    public win :BigNumber = new BigNumber(0);
    public subspins :SubSpinResponse[];
    public feature :FeatureResponse;
    public status :StatusResponse;
    public spinFeatures : SpinFeatureResponse[] = null;
    public cheats :number[] = null;

    constructor( version:string, name:string, error :string, state:SlotState ) {
        super(version, name, error);

        if (error !== null) { return; }

        this.status = new StatusResponse();
        this.status.action = state.gameStatus.action;
        this.status.nextAction = state.gameStatus.nextAction;
        this.status.totalBet = state.gameStatus.totalBet;
        this.status.totalWin = state.gameStatus.totalWin;

        this.reelId = state.paidSpin[0].reelId;
        this.initialGrid = state.paidSpin[0].initialGrid;
        this.grid = state.paidSpin[0].finalGrid;
        this.win = state.paidSpin[0].win;
        this.multiplier = state.paidSpin[0].multiplier;
        this.wins = [];
        state.paidSpin[0].wins.forEach( win => {
            this.wins.push( new PlaySlotWinsResponse( win.id, win.symbol, win.type, win.offsets, win.pay, win.wildIncluded) );
        });

        this.spinFeatures = [];
        state.paidSpin[0].features.forEach( feature => {
            if (feature.isActive) {
                const featureResp :SpinFeatureResponse = new SpinFeatureResponse();
                featureResp.active = feature.isActive;
                featureResp.symbol = feature.symbol;
                featureResp.id = feature.id;
                featureResp.offsets = feature.offsets;
                featureResp.level = feature.level;
                this.spinFeatures.push(featureResp );
            }
        })

        if (state.freespin !== null && state.freespin !== undefined){
            this.feature = new FeatureResponse();
            this.feature.left = state.freespin.left;
            this.feature.total = state.freespin.total;
            this.feature.accumulated = state.freespin.accumulated;
        }

        if (state.paidSpin.length > 1) {
            this.subspins = [];
            for (let i=1; i<state.paidSpin.length; i++ ) {
                const subspin :SubSpinResponse = new SubSpinResponse();
                subspin.grid = state.paidSpin[i].finalGrid;
                subspin.win = state.paidSpin[i].win;
                subspin.wins = [];
                state.paidSpin[i].wins.forEach( win => {
                    subspin.wins.push( new PlaySlotWinsResponse( win.id, win.symbol, win.type, win.offsets, win.pay, win.wildIncluded) );
                });
                
                subspin.id = state.paidSpin[i].cascade.id;
                subspin.offsets = state.paidSpin[i].cascade.offsets;
                subspin.type = state.paidSpin[i].cascade.type;
                subspin.prevWin = state.paidSpin[i].cascade.win;
                subspin.multiplier = state.paidSpin[i].multiplier;
                this.subspins.push( subspin);
            }
        }

        this.cheats = state.cheatNums;
    }
}

class StatusResponse{
    public action :string;
    public nextAction :string[] = [];
    public totalBet :BigNumber;
    public totalWin :BigNumber;
}

class SubSpinResponse {
    public id :number;
    public grid :number[][] = [];
    public wins :PlaySlotWinsResponse[] = []; 
    public win :BigNumber = new BigNumber(0);
    public offsets :number[] = [];
    public type :string;
    public multiplier :number;
    public prevWin :BigNumber = new BigNumber(0);
}

class FeatureResponse {
    public total :number;
    public left :number;
    public accumulated :BigNumber;
}

class SpinFeatureResponse {
    public id :string  = null;
    public active :boolean;
    public symbol :number;
    public offsets :number[]  = null;
    public level :string = null;
}

class PlaySlotWinsResponse {

    public id :number;
    public symbol :number;
    public type :string;
    public offsets :number[];
    public pay :BigNumber;
    public wildIncluded :boolean;

    constructor( id :number, symbol :number, type :string, offsets :number[], pay :BigNumber, wildIncluded :boolean ) {
        this.id = id;
        this.symbol = symbol;
        this.type = type;
        this.offsets = offsets;
        this.pay = new BigNumber(0).plus( pay);
        this.wildIncluded = wildIncluded;
    }

}