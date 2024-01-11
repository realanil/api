"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JungleQueenTester = void 0;
const platform_slot_tester_1 = require("./libs/platform/tester/platform_slot_tester");
const junglequeen_server_1 = require("./games/junglequeen/junglequeen_server");
class JungleQueenTester extends platform_slot_tester_1.PlatformSlotTester {
    constructor() {
        super();
        this.game = new junglequeen_server_1.GameServer();
        this.buybonus = false;
    }
    createSlotKeys() {
        super.createSlotKeys();
        // for (let i=0; i<12; i++) {
        //     let is:string = i.toString();
        //     if (is.length == 1) is = "0"+is;
        //     for (let j=1; j<15; j++) {
        //         let js:string = j.toString();
        //         if (js.length == 1) js = "0"+js;
        //         const key:string = `-mystery-level-${is}-symbol-${js}`; 
        //         this.createPayoutKey ( `main${key}` , `main-feature-details`, 1002 );
        //         this.createPayoutKey ( `freespin${key}` , `freespin-feature-details`, 1003 );
        //     }
        //     this.createPayoutKey(`main-mystery-level-${i === 0 ? 'R':is}`, "level-payout", 1000);
        //     this.createPayoutKey(`freespin-mystery-level-${is}`, "level-payout", 1001);
        // }
    }
    recordSlotRTP(state) {
        super.recordSlotRTP(state);
        // if ( state.gameStatus.action === "freespin" ) {
        //     const lastFS:boolean = this.isLastFreeSpin(state);
        //     if ( lastFS) {
        //         const jqState:JungleQueenState = state as JungleQueenState;
        //         const key:string = `final-freespin-mystery-level-${ jqState.mystryLevel}`; 
        //         this.createPayoutKey ( key , "final-freespin-mystery-level", 900 );  
        //         this.updateKeyCount( key);
        //         let count:string = jqState.mystrySymbolCount.toString(); 
        //         if (count.length == 2) count = "0" + count;
        //         if (count.length == 1) count = "00" + count;
        //         const key2:string = `final-freespin-mystery-count-${ count }`; 
        //         this.createPayoutKey ( key2 , "final-freespin-mystery-count", 901 );  
        //         this.updateKeyCount( key2);
        //     }
        // }
    }
    recordMysteryDetails(key, feature, priority, state, isLastSpin) {
        // let symbol:string = feature.symbol.toString();
        // if (symbol.length == 1) symbol = "0"+symbol
        // let level:string = feature.level.toString();
        // if (level.length == 1) level = "0"+level
        // const pkey:string = `${key}-${feature.id}-level-${level}-symbol-${symbol}`; 
        // this.updateKeyCount ( pkey);
        // this.updatePayout( `${key}-${feature.id}-level-${level}` , state.win);
    }
}
exports.JungleQueenTester = JungleQueenTester;
new JungleQueenTester().startTesting();
