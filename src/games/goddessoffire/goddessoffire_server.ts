import { BaseSlotGame } from "../../libs/platform/slots/base_slot_game";
import { CascadeState, SlotFeaturesState, SlotSpinState } from "../../libs/engine/slots/models/slot_state_model";
import { PlayResponseModel } from "../../libs/platform/slots/play_response_model";
import { ResponseModel } from "../../libs/platform/base/response_model";
import { ConfigResponseV2Model } from "../../libs/platform/slots/responses_v2";
import BigNumber from "bignumber.js";
import { RandomHelper } from "../../libs/engine/slots/utils/random";
import { CreateStops } from "../../libs/engine/slots/actions/create_stops";
import { CreateGrid } from "../../libs/engine/slots/actions/create_grid";
import { EvaluateWins } from "../../libs/engine/slots/actions/evaluate_wins";
import { CalculateWins } from "../../libs/engine/slots/actions/calculate_wins";
import { Grid } from "../../libs/engine/slots/utils/grid";
import { Cloner } from "../../libs/engine/slots/utils/cloner";
import { GoddessOfFireMath } from "./models/goddessoffire_math";
import { GoddessOfFireState } from "./models/goddessoffire_state";
import { GoddessOfFireResponseModel } from "./models/goddessoffire_response";
import { Symbols } from "../../libs/engine/slots/utils/symbols";
import { Layout } from "../../libs/engine/slots/utils/layout";
import { off } from "process";
import { ScatterSymbolCount } from "../../libs/engine/slots/conditions/scatter_symbol_count";
import { Triggerer } from "../../libs/engine/slots/features/triggerer";
import { UpdateFeature } from "../../libs/engine/slots/features/update_feature";
import { ConfigResponseV3Model } from "../../libs/platform/slots/responses_v3";



export class GameServer extends BaseSlotGame {

    constructor(){
        super("GoddessOfFire", "0.1");
        this.math = new GoddessOfFireMath();
    }

    protected executeBaseSpin() {
        let state:SlotSpinState = new SlotSpinState();
        
        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        const layout:number[] = Layout.weightedLayout(this.rng, this.math.collection["BaseGameLayout"] );
        layout.push(4);
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, layout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = this.replaceRandomSymbol( state.initialGrid);

        state.wins = EvaluateWins.WaysWins( this.math.info, this.updateGridToProcessWin(state.finalGrid), this.state.gameStatus.stakeValue, 1 );
        state.win = CalculateWins.AddPays( state.wins );

        this.state.paidSpin = [state];

        let win :BigNumber = BigNumber(state.win);
        let totalWin :BigNumber = BigNumber( state.win);
        let cascadeId: number = 0; 
        while ( win.isGreaterThan( BigNumber(0) )){
            const prevState :SlotSpinState = this.state.paidSpin[ this.state.paidSpin.length-1 ];

            const cascade :SlotSpinState = new SlotSpinState();
            cascade.stops = Cloner.CloneGrid( prevState.stops );
            cascade.cascade = new CascadeState();
            cascade.cascade.offsets = Symbols.UniqueWinningSymbols( prevState.wins);

            cascade.cascade.type = "cascade"; 
            cascade.cascade.id = cascadeId++;
            Grid.MarkOffsets( cascade.stops, this.updateOffsetsForCascade( cascade.cascade.offsets, prevState.finalGrid.length ) );
            cascade.stops = Grid.MoveMarkedOffsetsDown( cascade.stops);

            const stopsLastReel :number[] = cascade.stops[ cascade.stops.length-1 ];
            const newStops: number[] = [];
            for( let i=0; i<stopsLastReel.length; i++ ) {
                if ( stopsLastReel[i] !== -1 ) {
                    newStops.push( stopsLastReel[i] );
                }
            }
            for( let i=0; i<stopsLastReel.length; i++ ) {
                if ( stopsLastReel[i] === -1 ) {
                    newStops.push( stopsLastReel[i] );
                }
            }
            cascade.stops[ cascade.stops.length-1 ] = newStops;
            const initialStops :number[] = Grid.FirstStopFromStops( prevState.stops);
            
            cascade.stops = CreateStops.StandardStopsForNulls( initialStops, this.math.paidReels[0].reels , cascade.stops);
            const reversedStops = CreateStops.StandardReverseStopsForNulls( initialStops, this.math.paidReels[0].reels , cascade.stops);
            cascade.stops[ cascade.stops.length-1 ] = reversedStops[ reversedStops.length-1 ]
            
            cascade.initialGrid = CreateGrid.StandardGrid( this.math.paidReels[0].reels, cascade.stops);
            cascade.finalGrid = this.replaceRandomSymbol( cascade.initialGrid);
            cascade.wins = EvaluateWins.WaysWins( this.math.info, this.updateGridToProcessWin(cascade.finalGrid), this.state.gameStatus.stakeValue, 1 );
            cascade.win = CalculateWins.AddPays( cascade.wins );
            cascade.cascade.win = totalWin.plus( cascade.win);

            totalWin = totalWin.plus( cascade.win);
            win = BigNumber(cascade.win);
            
            this.state.paidSpin.push(cascade);
        }

        const lastState :SlotSpinState = this.state.paidSpin[ this.state.paidSpin.length-1 ];
        const freespins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], lastState );
        if (freespins.isActive) {
            Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinTrigger"]);
            Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinTrigger"]); 
        } 
        state.features = [ freespins];

        this.state.gameStatus.currentWin = totalWin;
        this.state.gameStatus.totalWin = totalWin;
        
    }

    protected executeBuyBonus() {
        let state:SlotSpinState = new SlotSpinState();         
        this.state.paidSpin = [state];
    }

    protected executeFreeSpin() {
        let state:SlotSpinState = new SlotSpinState();
        const fsIndex :number = this.state.freespins.length;

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.freeReels );
        state.reelId = selectedSet.id;
        const layout:number[] = Layout.weightedLayout(this.rng, this.math.collection["FreeGameLayout"] );
        layout.push(4);
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, layout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = this.replaceRandomSymbol( state.initialGrid);
        state.multiplier = (this.state as GoddessOfFireState).fsMultiplier;

        state.wins = EvaluateWins.WaysWins( this.math.info, this.updateGridToProcessWin(state.finalGrid), this.state.gameStatus.stakeValue, state.multiplier );
        state.win = CalculateWins.AddPays( state.wins ).multipliedBy( state.multiplier);

        this.state.freespins[fsIndex] = [state];

        let win :BigNumber = BigNumber(state.win);
        let totalWin :BigNumber = BigNumber( state.win);
        let cascadeId: number = 0; 
        while ( win.isGreaterThan( BigNumber(0) )){
            if ( !this.state.freespins[fsIndex] ) {
                console.log( fsIndex) 
            }
            const prevState :SlotSpinState = this.state.freespins[fsIndex][ this.state.freespins[fsIndex].length-1 ];

            const cascade :SlotSpinState = new SlotSpinState();
            cascade.stops = Cloner.CloneGrid( prevState.stops );
            cascade.cascade = new CascadeState();
            cascade.cascade.offsets = Symbols.UniqueWinningSymbols( prevState.wins);

            cascade.cascade.type = "cascade"; 
            cascade.cascade.id = cascadeId++;
            Grid.MarkOffsets( cascade.stops, this.updateOffsetsForCascade( cascade.cascade.offsets, prevState.finalGrid.length ) );
            cascade.stops = Grid.MoveMarkedOffsetsDown( cascade.stops);
            (this.state as GoddessOfFireState).fsMultiplier++;
            cascade.multiplier = (this.state as GoddessOfFireState).fsMultiplier;

            const initialStops :number[] = Grid.FirstStopFromStops( prevState.stops) ;
            CreateStops.StandardStopsForNulls( initialStops, this.math.freeReels[0].reels , cascade.stops);
            cascade.initialGrid = CreateGrid.StandardGrid( this.math.freeReels[0].reels, cascade.stops);
            cascade.finalGrid = this.replaceRandomSymbol( cascade.initialGrid);
            cascade.wins = EvaluateWins.WaysWins( this.math.info, this.updateGridToProcessWin(cascade.finalGrid), this.state.gameStatus.stakeValue, state.multiplier );
            cascade.win = CalculateWins.AddPays( cascade.wins ).multipliedBy( cascade.multiplier);;
            cascade.cascade.win = totalWin.plus( cascade.win);

            totalWin = totalWin.plus( cascade.win);
            win = BigNumber(cascade.win);
            
            this.state.freespins[fsIndex].push(cascade);
        }

        const lastState :SlotSpinState = this.state.freespins[fsIndex][ this.state.freespins[fsIndex].length-1 ];
        let freespins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinReTrigger3"], lastState );
        if (freespins.isActive) {
            Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinReTrigger3"]);
            Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinReTrigger3"]); 
        } else {
            freespins = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinReTrigger4"], lastState );
            if (freespins.isActive) {
                Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinReTrigger4"]);
                Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinReTrigger4"]); 
            }
        } 
        state.features = [ freespins];

        UpdateFeature.updateFreeSpinCount( this.state);

        this.state.gameStatus.currentWin = totalWin;
        this.state.freespin.accumulated = BigNumber( this.state.freespin.accumulated).plus(totalWin); 
        this.state.gameStatus.totalWin = BigNumber(this.state.gameStatus.totalWin).plus(totalWin);
        
    }

    protected getPlayResponse():ResponseModel {
        return new GoddessOfFireResponseModel( this.version, this.name, this.math, this.state as GoddessOfFireState);
    }

    protected getConfigResponse( response:PlayResponseModel):ResponseModel {
        return new ConfigResponseV3Model( this.version, this.name, this.math, this.state);
    }

    protected defaultEmptyState():GoddessOfFireState {
        return new GoddessOfFireState()
    }

    protected updateGridToProcessWin( grid:number[][]) :number[][] {
        const gridForWin :number[][] = [];

        for(let i:number=0; i<grid.length-1; i++) {
            gridForWin[i] = Cloner.CloneObject( grid[i] );
        }
        
        const lastreel :number[] = grid[grid.length-1];
        for(let i=0; i<lastreel.length ; i++ ) {
            gridForWin[i+1].unshift( lastreel[i] );
        }

        gridForWin[0].unshift(-1);
        gridForWin[ gridForWin.length-1].unshift(-1);

        return gridForWin; 
    }

    protected updateOffsetsForCascade( offsets:number[], finallength:number) :number[] {
        
        const originalLength = finallength-1; 
        const decoded :{ col:number, row:number}[] = [];
        
        offsets.forEach( (offset:number) => {
            const col :number = offset % originalLength;
            const row :number = Math.floor(offset/originalLength);
            decoded.push( {col, row});
        });

        decoded.forEach( d => {
            if (d.row === 0) {
                d.row = d.col-1;
                d.col = finallength-1;
            } else {
                d.row--;
            }
        }) 

        const encode:number[] = [];
        decoded.forEach( d => {
            encode.push( (finallength * d.row) + d.col );
        })

        return encode;
    }

    protected replaceRandomSymbol( grid :number[][]) :number[][] {
        let newGrid = Cloner.CloneGrid( grid);
        const reel1Offsets = Grid.FindScatterOffsetsInReels( 12, [0], newGrid);
        if (reel1Offsets.length > 0) {
            const randomSymbols = [];
            newGrid[1].forEach( symbol => {
                if ( symbol !== 11 && symbol !== 12 ) {
                    randomSymbols.push( { weight : 1, symbol : symbol } );
                }
            })
            const symbol :any = RandomHelper.GetRandomFromList( this.rng, randomSymbols);
            newGrid = Grid.ReplaceSymbolsInOffsets( reel1Offsets, newGrid, symbol.symbol);
        }

        const reel23Offsets = Grid.FindScatterOffsetsInReels( 12, [1, 2, 3], newGrid);
        if (reel23Offsets.length > 0) {
            const randomSymbols = [];
            newGrid[0].forEach( symbol => {
                if ( symbol !== 11 && symbol !== 12 ) {
                    randomSymbols.push( { weight : 1, symbol : symbol } );
                }
            })
            const symbol :any = RandomHelper.GetRandomFromList( this.rng, randomSymbols);
            newGrid = Grid.ReplaceSymbolsInOffsets( reel23Offsets, newGrid, symbol.symbol);
        }

        return newGrid;

    }

}
