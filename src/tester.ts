import { PlatformSlotTester } from "./libs/platform/tester/platform_slot_tester";
import { SlotocrashServer } from "./games/slotocrash/slotocrash_server";
import { RequestModel } from "./libs/platform/slots/request_model";
import { SlotocrashState } from "./games/slotocrash/models/slotocrash_state";
import { SlotState } from "./libs/engine/slots/models/slot_state_model";

export class SlotoCrashTester extends PlatformSlotTester {

    constructor(){
        super();
        this.game = new SlotocrashServer();
    }

    protected recordSlotRTP( state:SlotState) {
        if (state.gameStatus.action == "collect") {
            this.recordSymbolRTP( state.paidSpin[0], "main" );
        }
    }

    protected requestModel() :RequestModel {
        const strategy :number = 4;
        const request :RequestModel = super.requestModel();
        const state :SlotocrashState = this.state as SlotocrashState;
        let gridlength :number = 0;
        switch( strategy){
            case 0:
                gridlength = 3; break;
            case 1:
                gridlength = 4; break;
            case 2:
                gridlength = 5; break;
            case 3:
                gridlength = 10; break;
            case 4:
                gridlength = 15; break;
        }

        if (state && state.paidSpin[0].finalGrid.length == gridlength && state.gameStatus.nextAction.includes("collect")) {
            request.action = "collect"; 
        }

        return request;        
    }

}

new SlotoCrashTester().startTesting( 5000000);
