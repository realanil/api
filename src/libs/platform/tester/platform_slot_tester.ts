import BigNumber from "bignumber.js";
import { SlotTester } from "../../engine/slots/tester/slot_tester";
import { BaseSlotGame } from "../slots/base_slot_game";
import { RequestModel } from "../slots/request_model";
import { ServerResponseModel } from "../slots/server_response_model";

export class PlatformSlotTester extends SlotTester {

    protected game :BaseSlotGame;

    public startTesting( spinsCount :number = 100000000) {
        super.startTesting( spinsCount);

        while( spinsCount > 0) {
            const response :ServerResponseModel = this.game.play( this.requestModel() );
            if (response.response.error !== null) {
                console.log( response.response.error);
                break;
            }

            this.state = response.state;
            this.calculateGameRTP();
            this.recordSlotRTP(this.state);
            if ( this.state.gameStatus.nextAction.includes("spin") ) {
                spinsCount--;
                if ( spinsCount %50000 == 0) {
                    console.log( spinsCount, this.getGameRTP().toNumber() )
                } 
                if ( spinsCount == 0 ) {
                    this.printReport();
                }        
            }
        }
    }

    protected requestModel() :RequestModel {
        const request :RequestModel = new RequestModel();
        request.action =  this.state && this.state.gameStatus ? this.state.gameStatus.nextAction[0] : "spin";
        request.stake = new BigNumber(1);
        request.state = this.state;
        return request;
    }
    
}
