import { BaseSlotGame } from "../../libs/platform/slots/base_slot_game";
import { FeatureDetails, SlotFeaturesState, SlotSpinState, SlotSpinWinsState } from "../../libs/engine/slots/models/slot_state_model";
import { CreateGrid } from "../../libs/engine/slots/actions/create_grid";
import { Cloner } from "../../libs/engine/slots/utils/cloner";
import { CalculateWins } from "../../libs/engine/slots/actions/calculate_wins";
import { PlayResponseModel } from "../../libs/platform/slots/play_response_model";
import { JungleQueenResponseModel } from "./models/junglequeen_response";
import { JungleQueenState } from "./models/junglequeen_state";
import { JungleQueenMath } from "./models/junglequeen_math";
import { CreateStops } from "../../libs/engine/slots/actions/create_stops";
import { EvaluateWins } from "../../libs/engine/slots/actions/evaluate_wins";
import { RandomHelper } from "../../libs/engine/slots/utils/random";
import { RandomCondition } from "../../libs/engine/slots/conditions/random_condition";
import { Grid } from "../../libs/engine/slots/utils/grid";
import { CustomWins } from "./evaluate/CustomWins";
import { ResponseModel } from "../../libs/platform/base/response_model";
import { ConfigResponseV2Model } from "../../libs/platform/slots/responses_v2";
import { ScatterSymbolCount } from "../../libs/engine/slots/conditions/scatter_symbol_count";
import { Triggerer } from "../../libs/engine/slots/features/triggerer";
import BigNumber from "bignumber.js";
import { UpdateFeature } from "../../libs/engine/slots/features/update_feature";
import { RandomObj } from "../../libs/engine/generic/rng/random";
import { SlotConditionMath } from "../../libs/engine/slots/models/slot_math_model";


export class GameServer extends BaseSlotGame {

    constructor(){
        super("JungleQueen", "0.5");
        this.math = new JungleQueenMath();
    }

    protected executeBaseSpin() {
        // check for mystery feature 
        const useMysteryReels:SlotFeaturesState = RandomCondition.IsAvailable(this.math.conditions["UseMysteryReels"], this.rng);
        let spinState:SlotSpinState = null; 
        
        if ( useMysteryReels.isActive) {
            spinState = this.executeMysteryBaseSpin( useMysteryReels);
        } else {
            spinState = this.executeNonMysteryBaseSpin();
            let random:number = this.rng.getRandom( new RandomObj(0, 10, 1)).num;  
            while( !spinState.win.isZero() && spinState.win.isLessThan( this.state.gameStatus.totalBet) && random < 6) {
                spinState = this.executeNonMysteryBaseSpin();
                random = this.rng.getRandom( new RandomObj(0, 10, 1)).num;  
            }
        }
        
        this.state.gameStatus.currentWin = spinState.win;
        this.state.gameStatus.totalWin = spinState.win;
        this.state.paidSpin = [spinState];
    }

    private executeMysteryBaseSpin( mystery:SlotFeaturesState):SlotSpinState {
        let state:SlotSpinState = new SlotSpinState(); 
        const jqMath:JungleQueenMath = this.math as JungleQueenMath; 

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidFeatureReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = Cloner.CloneGrid( state.initialGrid);

        state.features = [];
        const level:any = RandomHelper.GetRandomFromList( this.rng, this.math.actions["BaseGameLevels"].feature );
        state.finalGrid = Grid.ReplaceSymbolsInGrid( level.symbols , state.finalGrid, jqMath.mystrySymbolId );

        mystery.level = level.id;
        mystery.offsets = Grid.FindScatterOffsets( jqMath.mystrySymbolId, state.finalGrid );
        
        const mystrySymbols = this.math.actions["BaseLevelsMystery"].features[ level.id-1];
        const selectedSymbol:any = RandomHelper.GetRandomFromList( this.rng, mystrySymbols);
        mystery.symbol = selectedSymbol.symbols[0];
        state.finalGrid = Grid.ReplaceSymbolsInGrid( [jqMath.mystrySymbolId] , state.finalGrid, mystery.symbol );
        
        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        state.wins = state.wins.concat( CustomWins.EvaluateGoldWin(this.rng, this.math as JungleQueenMath, state.finalGrid, this.state.gameStatus.totalBet));
        state.win = CalculateWins.AddPays( state.wins );

        if (state.win < this.state.gameStatus.stakeValue && this.rng.getRandom( new RandomObj(0, 10, 1)).num < 7) {
            mystery.offsets = Grid.FindScatterOffsets( this.math.conditions["UseMysteryReels"].symbol, state.initialGrid );
            const mysterySymbol:any = RandomHelper.GetRandomFromList( this.rng, this.math.actions["BaseMysteryOnly"].feature );
            mystery.level = "R";
            mystery.symbol = mysterySymbol.symbols[0];
            state.finalGrid = Grid.ReplaceSymbolsInOffsets( mystery.offsets , state.initialGrid, mystery.symbol );
            state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
            state.win = CalculateWins.AddPays( state.wins );
        }
        state.features = [ mystery];

        return state;

    }

    private executeNonMysteryBaseSpin( ):SlotSpinState {
        let state:SlotSpinState = new SlotSpinState(); 

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = Cloner.CloneGrid( state.initialGrid);

        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        state.win = CalculateWins.AddPays( state.wins );

        this.state.freespin = new FeatureDetails();
        this.state.gameStatus.nextAction = ["spin"];
        const freespins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], state );

        if (freespins.isActive) {
            Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinTrigger"]);
            Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinTrigger"]); 
            const jqState:JungleQueenState = this.state as JungleQueenState; 
            jqState.mystrySymbolCount = 0;
            jqState.mystryLevel = 0;
            jqState.multiplier = 1;
        } 
        state.features = [ freespins];

        return state;
    }

    protected executeBuyBonus() {
        let state:SlotSpinState = new SlotSpinState();         
        const bbAward:any = RandomHelper.GetRandomFromList( this.rng, this.math.collection["BuyBonusAward"]);
        
        const condition:SlotConditionMath = new SlotConditionMath();
        condition.oak = [bbAward.count];
        condition.symbol = 12;
        
        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = Cloner.CloneGrid( state.initialGrid);

        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        state.win = CalculateWins.AddPays( state.wins );

        let feature = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], state );

        
        while( !feature.isActive || state.win.isGreaterThan(0) ){
            state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
            state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
            state.finalGrid = Cloner.CloneGrid( state.initialGrid);

            state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
            state.win = CalculateWins.AddPays( state.wins );

            feature = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], state );
        }
        
        
        if (feature.isActive) {
            Triggerer.UpdateFeature(this.state, feature, this.math.actions["FreespinTrigger"]);
            Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinTrigger"]); 
            const jqState:JungleQueenState = this.state as JungleQueenState; 
            jqState.mystrySymbolCount = 0;
            jqState.mystryLevel = 0;
            jqState.multiplier = 1;
        }

        state.features = [ feature];
        this.state.paidSpin = [state];
    }

    protected executeFreeSpin() {
        let state:SlotSpinState = new SlotSpinState();

        const jqState:JungleQueenState = this.state as JungleQueenState; 
        const jqMath:JungleQueenMath = this.math as JungleQueenMath; 
    
        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.freeReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);

        const symbolsToMystery:number[] = this.math.actions["FreeLevelsMystery"].feature[ jqState.mystryLevel].symbols;
        state.finalGrid = Grid.ReplaceSymbolsInGrid( symbolsToMystery , state.initialGrid, jqMath.mystrySymbolId );
        
        const mystrySymbols = this.math.actions["FreeLevelsMystery"].features[ jqState.mystryLevel ];
        const selectedSymbol:any = RandomHelper.GetRandomFromList( this.rng, mystrySymbols);

        state.features = [];
        const mystery:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["MysteryTrigger"], state );        
        if (mystery.isActive ) {
            jqState.mystrySymbolCount += mystery.offsets.length;

            let mystLevel = this.math.collection["FreeSpinLevelcondition"].find( coll => jqState.mystrySymbolCount >= coll.from && jqState.mystrySymbolCount < coll.to );
            if (mystLevel === undefined || mystLevel === null ){
                mystLevel = this.math.collection["FreeSpinLevelcondition"].find( coll => jqState.mystrySymbolCount >= coll.from && coll.to === -1 );
            }
            mystery.level = mystLevel.level;
            
            const level:number = parseInt(mystery.level); 
            if ( level !== jqState.mystryLevel ) {
                const diff:number = level - jqState.mystryLevel;
                jqState.mystryLevel = level;
                jqState.multiplier += diff;

                const action = this.math.actions["FreespinReTrigger"];
                mystery.triggers = action.triggers;
                mystery.count = action.spins * diff;

                this.state.freespin.left += mystery.count;
                this.state.freespin.total += mystery.count;
                this.state.freespin.retrigger = mystery.count;
            }

        }
        state.features.push( mystery);

        mystery.symbol = selectedSymbol.symbols[0];
        state.finalGrid = Grid.ReplaceSymbolsInGrid( [jqMath.mystrySymbolId] , state.finalGrid, mystery.symbol );

        state.multiplier = jqState.multiplier;
        
        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        const totalBet:BigNumber = new BigNumber(this.state.gameStatus.stakeValue).multipliedBy( this.math.info.betMultiplier);
        const goldWins:SlotSpinWinsState[] = CustomWins.EvaluateGoldWin(this.rng, jqMath, state.finalGrid, totalBet );
        state.wins = state.wins.concat(goldWins );        
        state.win = CalculateWins.AddPays( state.wins ).multipliedBy( state.multiplier);

        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = new BigNumber( this.state.gameStatus.totalWin ).plus (state.win);
        this.state.freespin.accumulated = new BigNumber( this.state.freespin.accumulated ).plus (state.win);

        UpdateFeature.updateFreeSpinCount( this.state);

        this.state.freespins.push( [state] );
        
    }

    protected getPlayResponse():ResponseModel {
        return new JungleQueenResponseModel( this.version, this.name, this.math, this.state as JungleQueenState);
    }

    protected getConfigResponse( response:PlayResponseModel):ResponseModel {
        return new ConfigResponseV2Model( this.version, this.name, this.math, this.state);
    }

    protected defaultEmptyState():JungleQueenState{
        return new JungleQueenState()
    }

}
