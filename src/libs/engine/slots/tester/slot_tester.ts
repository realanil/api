import BigNumber from "bignumber.js";
import { PayoutTester } from "../../generic/tester/payout-tester";
import { SlotSpinState, SlotState } from "../models/slot_state_model";

export class SlotTester extends PayoutTester {

    protected state :SlotState

    constructor(){
        super();
        this.createSlotKeys();
    }

    protected createSlotKeys() {    
        let priority = 5000;
        for( let s:number=0; s<5; s++){
            for( let oak:number=0; oak<5; oak++){
                this.createPayoutKey( `main-${s}-${oak}oak`, 'mainspin', priority++ );
            }
        }
    }

    protected recordSlotRTP( state:SlotState) {
        this.recordSymbolRTP( state.paidSpin[0], "main" )
    }

    protected recordSymbolRTP( state :SlotSpinState , id :string) {
        state.wins.forEach( win => {
            const key = `${id}-${win.symbol}-${win.offsets.length}oak`;
            this.updatePayout( key , win.pay);
        });
    }

    protected calculateGameRTP(){
        if ( this.state.gameStatus.action == "spin" ) {
            this.updateTotalBetAndWin( this.state.gameStatus.totalBet, new BigNumber(0));
        }
        this.updateTotalBetAndWin( new BigNumber(0), this.state.gameStatus.totalWin);
    }
    
}
