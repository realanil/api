import BigNumber from "bignumber.js";
import { PayoutTester } from "../../generic/tester/payout-tester";
import { SlotFeaturesState, SlotSpinState, SlotState } from "../models/slot_state_model";

export class SlotTester extends PayoutTester {

    protected state:SlotState
    protected buybonus:boolean=false;

    constructor(){
        super();
        this.createSlotKeys();
        require('dotenv').config();
    }

    protected createSlotKeys() {    

        this.createPayoutKey("main-spins", "summery", 10);
        this.createPayoutKey("freespin-spins", "summery", 12);

        let priority = 5000;
        for( let s:number=0; s<20; s++){
            for( let oak:number=0; oak<9; oak++){
                this.createPayoutKey( `main-${s}-${oak}oak`, 'mainspin', priority++ );
            }
        }

        for( let s:number=0; s<20; s++){
            for( let oak:number=0; oak<9; oak++){
                this.createPayoutKey( `freespin-${s}-${oak}oak`, 'freespin', priority++ );
            }
        }
    }

    protected recordSlotRTP( state:SlotState) {
        switch( state.gameStatus.action ){
            case "spin":
                this.recordSlotSpinRTP( "main", state.paidSpin[0], true );
                break;
            case "buybonus":
                this.recordSlotSpinRTP( "main", state.paidSpin[0], true );
                break;
            case "freespin":
                const lastFS:boolean = this.isLastFreeSpin(state);
                this.recordSlotSpinRTP( "freespin", state.freespins[ state.freespins.length-1 ][0], lastFS );
                break;
        }
    }

    protected isLastFreeSpin( state: SlotState):boolean{
        return state.gameStatus.action === "freespin" && state.gameStatus.nextAction.includes("spin");
    }

    protected recordSlotSpinRTP( key:string, state:SlotSpinState, isLastSpin:boolean) {
        this.updatePayout( `${key}-spins` , state.win );

        this.createPayoutKey( `${key}-reel-${state.reelId}`, "reels", 50);
        this.updatePayout( `${key}-reel-${state.reelId}`, state.win);

        let multiplier:string = state.multiplier.toString();
        if (multiplier.length == 2) multiplier = "0" + multiplier;
        if (multiplier.length == 1) multiplier = "00" + multiplier;

        this.createPayoutKey( `${key}-x${multiplier}`, "multiplier", 500);
        this.updateKeyCount( `${key}-x${multiplier}`);

        if (isLastSpin && key !== "main") {
            this.createPayoutKey( `last-${key}-x${multiplier}`, "final-multiplier", 600);
            this.updateKeyCount( `last-${key}-x${multiplier}`);
        }

        this.recordSymbolRTP( state, key);
        
        state.features.forEach( feature => {
            this.createPayoutKey( `${key}-${feature.id}`, `feature`, 100 );
            if (feature.isActive) {
                this.updateKeyCount( `${key}-${feature.id}` );
                this.recordFeatureDetils( key, feature, state, isLastSpin );
            }
        });
    }

    protected recordFeatureDetils(key: string, feature: SlotFeaturesState, state:SlotSpinState, isLastSpin: boolean) {
        const p = { "main": 3000, "freespin": 4000 }

        switch( feature.id ) {
            case "mystery":
                this.recordMysteryDetails( key, feature, p[key], state, isLastSpin);
                break;
        }
    }

    protected recordMysteryDetails(key: string, feature: SlotFeaturesState, priority: number, state:SlotSpinState, isLastSpin:boolean) {
        const pkey:string = `${key}-${feature.id}-symbol-${feature.symbol}`; 
        this.createPayoutKey (pkey , `${key}feature-details`, priority );
        this.updateKeyCount ( pkey);
    }

    protected recordSymbolRTP( state:SlotSpinState , id:string) {
        state.wins.forEach( win => {
            const key = `${id}-${win.symbol}-${win.offsets.length}oak`;
            this.updatePayout( key , win.pay);
        });
    }

    protected calculateGameRTP(){
        if ( ["spin", "buybonus"].includes( this.state.gameStatus.action) ) {
            this.updateTotalBetAndWin( this.state.gameStatus.totalBet, new BigNumber(0));
        }
        this.updateTotalBetAndWin( new BigNumber(0), this.state.gameStatus.currentWin);
    }
    
}
