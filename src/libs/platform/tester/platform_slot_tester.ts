import BigNumber from "bignumber.js";
import { SlotTester } from "../../engine/slots/tester/slot_tester";
import { BaseSlotGame } from "../slots/base_slot_game";
import { RequestModel } from "../slots/request_model";
import { ServerResponseModel } from "../slots/server_response_model";

export class PlatformSlotTester extends SlotTester {

    protected game :BaseSlotGame;

    public startTesting() {
        let spinsCount:number = 100000000;
        if ( process.argv.length >= 4 ) {
            spinsCount = parseInt(process.argv[3] ); 
        }
        console.log( "spinsCount", spinsCount);

        super.startTesting( spinsCount);
        while( spinsCount > 0) {
            const response :ServerResponseModel = this.game.play( this.requestModel() );
            if (response.response.error !== null && response.response.error.length > 2 ) {
                console.log( response.response.error);
                break;
            }
            
            this.state = response.state;
            this.calculateGameRTP();
            this.recordSlotRTP(this.state);
            if ( this.state.gameStatus.nextAction.includes("spin") ) {
                spinsCount--;
                this.printProgressReport( spinsCount);
                if ( spinsCount == 0 ) {
                    this.printReport();
                }        
            }
        }
    }

    protected requestModel() :RequestModel {
        const request :RequestModel = new RequestModel();
        request.action =  this.state && this.state.gameStatus ? this.state.gameStatus.nextAction[0] : "spin";
        request.action = this.buybonus && request.action === "spin" ? "buybonus" : request.action;
        request.id = "buybonus";
        request.stake = BigNumber(10);
        request.state = this.state;
        return request;
    }
    
}
