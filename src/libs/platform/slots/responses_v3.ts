import BigNumber from "bignumber.js";
import { SlotInfoMath } from "../../engine/slots/models/slot_math_model";
import { SlotSpinState, SlotState } from "../../engine/slots/models/slot_state_model";
import { PlatformMath } from "../base/platform_math";
import { ResponseModel } from "../base/response_model";
import { Symbols } from "../../engine/slots/utils/symbols";

export class PlayResponseV3Model extends ResponseModel {
    
    public response:PlayResponse; 

    constructor( version:string, name:string, math:PlatformMath, state:SlotState ){
        super( version, name, "");
        this.response = new PlayResponse( name, math, state);
    }

}

export class ConfigResponseV3Model extends ResponseModel {

    public response:ConfigResponse; 

    constructor( version:string, name:string, math:PlatformMath, state:SlotState ){
        super( version, name, "");
        this.response = new ConfigResponse( name, math, state, "initGame");
    }
}

class PlayResponse {

    public stake :number;
    public settings;
    public allowedCommands :string[];
    public state;
    public transition;
    public requestCommand :string;

    constructor( name:string, math:PlatformMath, state:SlotState) {
        this.stake = state.gameStatus.totalBet.toNumber();
        this.settings = {};
        this.allowedCommands = state.gameStatus.nextAction;
        this.state = new StateResponse( name, math, state, true );
        this.transition = new StateResponse( name, math, state, false);
        this.requestCommand = state.gameStatus.action;
    }
}

class ConfigResponse {

    public stake :number;
    public settings;
    public configuration;
    public allowedCommands :string[];
    public isRestore :boolean;
    public state;
    public gameOptions;
    public requestCommand :string;

    constructor( name:string, math:PlatformMath, state:SlotState, command:string) {
        this.stake = state.gameStatus.totalBet.toNumber();
        this.settings = {};
        this.configuration = new ConfigurationResponse( math, state);
        this.allowedCommands = state.gameStatus.nextAction;
        this.isRestore = false;
        this.state = new StateResponse( name, math, state, true );
        this.gameOptions = gameOptions;
        this.gameOptions.autoPlaySpinSteps = math.autoPlayValues;
        this.requestCommand = command;
    }
}

class StateResponse {

    public bet;
    public balance;
    public totalWin;
    public winOfRound :{ credits:BigNumber, freeGames:number};

    constructor( name:string, math:PlatformMath, state:SlotState, renderLast:boolean) {
        const symbols :string[] = []
        math.info.symbols.forEach( symbol => {
            symbols.push( symbol.name.toUpperCase() );
        })

        this.bet = state.gameStatus.totalBet;
        this.totalWin = state.gameStatus.totalWin;
        const spins: SlotSpinState[] = getActionSpins( state); 
        this[name.toLowerCase() ] = {
            subSpins : spins?.length > 0 ? this.renderSubSpins( symbols, renderLast ? [ spins[ spins.length-1 ] ] : spins  ) : [], 
            basicWin : { credits : state.gameStatus.currentWin, winFactor : state.gameStatus.currentWin }
        }
        this.winOfRound = { credits:state.gameStatus.currentWin, freeGames:state.freerespin?.left };
    }

    renderSubSpins( symbols:string[], spins: SlotSpinState[] ):SubSpins[] {
        const subspins :SubSpins[] = [];
        spins.forEach( spin => {
            subspins.push( new SubSpins( symbols, spin)  );
        })
        return subspins;
    }
}

class SubSpins {

    public reels :string[][];
    public winnings :Winnings;

    constructor( symbols:string[], spin:SlotSpinState ) {
        this.reels = this.renderReels(symbols, spin.finalGrid );
        this.winnings = new Winnings( symbols, spin);
    }

    renderReels( symbols:string[], grid: number[][]) {
        const response :string[][] = [];
        for( let i=0; i<grid.length; i++ ) {
            response[i] = [];
            for( let j=0; j<grid[i].length; j++ ){
                response[i][j] = symbols[ grid[i][j] ];
            }
        }
        return response;
    }
}

class Winnings {

    public credits:BigNumber;
    public multiplier:number;
    public positions:number[];
    public paytable;

    constructor(symbols:string[], spin:SlotSpinState ) {
        this.credits = spin.win;
        this.multiplier = spin.multiplier;
        this.positions = Symbols.UniqueWinningSymbols( spin.wins);

        this.paytable = {};
        for( let i:number=0; i<spin.wins.length; i++ ){
            const symbol:string = symbols[ spin.wins[i].symbol];
            this.paytable[ symbol] = { matchCount:0, waysCount: spin.wins[i].offsets.length };
        }
        for( let i:number=0; i<spin.wins.length; i++ ){
            const symbol:string = symbols[ spin.wins[i].symbol];
            this.paytable[ symbol]["matchCount"]++;
        }
    }
}

class ConfigurationResponse {

    public maxWinOdds :string;
    public rtp :string; 
    public betSteps: { possibleValues:number[], defaultValue:number};
    public paytables :PaytableResponse[];    
    
    constructor(  math:PlatformMath, state:SlotState) {
        this.betSteps = { 
            possibleValues : math.bets.map( bet => BigNumber(bet).multipliedBy( math.info.betMultiplier).toNumber() ) , 
            defaultValue : BigNumber(math.defaultBet).multipliedBy( math.info.betMultiplier).toNumber()  
        };
        
        this.paytables = [];
        math.bets.forEach( bet => {
            this.paytables.push( new PaytableResponse( math.info, bet, math.info.betMultiplier ) )
        } )
    }
}

class PaytableResponse {

    public betStep: BigNumber;
    public payoutsPerBetStepAndSymbol: { symbolId:string, paytable:BigNumber[]}[]

    constructor(  math:SlotInfoMath, stake:number, multiplier:BigNumber) {
        this.betStep = BigNumber(stake).multipliedBy(multiplier);
        this.payoutsPerBetStepAndSymbol = [];
        math.symbols.forEach( symbol => {
            this.payoutsPerBetStepAndSymbol.push( { symbolId:symbol.name, paytable:symbol.payout.map( e => e.multipliedBy( BigNumber(stake)) ) } )
        })
    }
}



const gameOptions = {
    "currencyAdditionalMultiplier": 100,
    "showRTP": false,
    "debugEnabled": true,
    "autoPlaySingleWinLimitPercentage": 0,
    "currencySymbolPrintedBefore": false,
    "autoPlaySingleWinLimitMandatory": false,
    "autoPlaySpinStartValue": 0,
    "enableAutoPlay": true,
    "showSlotSessionStatistics": false,
    "currencyGroupingSeparator": ",",
    "sessionTimeoutInSeconds": 1800,
    "showTime": false,
    "showVolumeControl": true,
    "languageCode": "en",
    "minimumGameDurationMs": 0,
    "autoPlayWinLimitMandatory": false,
    "maxWinMultiplier": 1000.0,
    "realityCheckTimeoutInSeconds": 0,
    "homeUrl": "",
    "disableQuickStop": false,
    "autoPlayExpertMode": false,
    "autoPlaySpinSteps": [],
    "showSettingsControl": true,
    "autoPlayLossLimitEnabled": true,
    "autoPlaySimpleMode": true,
    "suppressCelebrationForWinsBelowStake": false,
    "locale": "en",
    "currencyDecimalSeparator": ".",
    "autoPlaySpinResetToStartValue": false,
    "responsibleGamingUrl": "",
    "enableRiskCard": false,
    "enableRiskLadder": false,
    "countryCode": "",
    "currencyIgnoreDecimals": true,
    "showCloseButton": true,
    "realityCheckTimePassedInSeconds": 0,
    "autoPlayWinLimitPercentage": 0,
    "showResponsibleGamingIcon": false,
    "autoPlayFreeGamesAutoStart": true,
    "showFullScreenButton": true,
    "autoPlayLossLimitPercentage": 0,
    "showHelpButton": true,
    "currencySymbol": "",
    "cheatingEnabled": true,
    "responsibleGamingIconPath": "",
    "historyUrl": "",
    "showTopWinOdds": false,
    "autoPlayLossLimitMandatory": false,
    "autoPlaySingleWinLimitEnabled": false,
    "autoPlayAbortOnFreeGameWinEnabled": false,
    "disableQuickSpin": false,
    "autoPlayWinLimitEnabled": false,
    "currencyCode": ""
}

function getActionSpins(state: SlotState): SlotSpinState[] {
    switch( state.gameStatus.action ) {
        case "spin": return state.paidSpin; 
        case "buybonus": return  state.paidSpin;
        case "freespin": return state.freespins[ state.freespins.length-1]; 
        case "respin": return state.respins[ state.respins.length-1];
        case "freerespin": return state.freerespins[ state.freerespins.length-1];
        default:break;
    }
}

