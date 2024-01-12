# @bonanza/slot-lib 
> 0.0.3 
```
This is a generic library that can be used to develop Slot Games. It is focused towards Bonanza games. 

It has generic classes that needs to be passed data and it will return response accordingly.  
```

## Prerequisite
* Authorization  
* Node 

## How To Use 
* Install updated package to your game folder 
* Use the classes in their current state as it is 
* Never update any class inside slot-lib 
* If needed, you can override the class in your game package 

## New Game 
### Create Game 
* Create game_math class and extend it with PlatformMath 
* * Populate game specific math referring to [Math](#math-structure) Session  
* Create game_server class and extend it with BaseSlotGame  
* * In constructor, initialize math 
* * Create protected method, executeBaseSpin and write logic for spin in the method using [Actions](#actions) and [Utils](#utils)
* * Create other execute methods based on actions  

### Run Server 
* Games are automatically available if best practice is followed 

### Run Tester 
* create tester and extend it with PlatformSlotTester 
* * in constructure initialize game 
* call startTesting method 

### Best Practice 
* Create a folder "games/{game_name}" and inside it, create 
* * {game_name}_server and extend it with BaseSlotGame   
* * Create models folder 
* * * Create {game_name}_math class and extend it with PlatformMath 
* * * Create {game_name}_response class and extend it with PlayResponseV2Model  
* * * Create {game_name}_state class and extend it with SlotState 
* * Create actions, evaluator, etc for game specific requirenments if needed 

## Math Structure 
* defaultgrid - default grid to show when it is first spin 
* info - generic game info 
* * betMultiplier - to calculate stake per line/total bet 
* * gridLayout - a list of number of symbols in each reel 
* * wildSymbols - list of wild symbols 
* * payLines - List of paylines in 0/1 format 
* * symbols - all symbols, with name, id and payout 
* buyBonus - list of all available buybonus options 
* paidReels - list of paid reels. We have similar for freeReels, etc 
* conditions - An object of conditions, if satisfied, 
* actions - Actins linked to conditions. You can access them using keys. 
* collection - Data we need for calculation.    


## Run And Test 
### Demo Mode 
In the game, we need to do following 
* npm i . 
* npm run dev (to run in dev mode) 
* npm run test (to test RTP)

### Integrated with platform 
* Follow instructions as provided by platform with which the game is integrated  

## Library Overview  
```
Code is divided into three parts 
```
### Generic 
```
This is very generic library. In case we need to create any other library, we can use code from generic library as base to start. 
```
#### Structure  
* models - Very basic models, to be overridden in slot library  
* rng - Interface to be implemented by platform 
* tester - Basic tester that collects data and prints  

### Slots 
```
Totally focused on Slot Games. It needs generic code to compile. It helps with logical support for any slot game.  
```
#### Structure 
* actions - All logics to help create game 
* conditions - In order to trigger especific scenarios 
* evaluators - For win evaluations 
* features - To update feature details 
* models - Extended from generic, models for slots  
* tester - Extended from generic, to collect slot data 
* utils - Helper classes for slots 

### Platform 
```
In order to run games, we need it to be integrated with a platform/RGS. It sends call to game, provides RNG support, generates response for player and takes care of state. 
```
#### Structure 
* base - Helps integrate with platform and implement RNG 
* slots - Parse request and response for slots 
* tester - Extended from slot tester with platform specific code   

## Important Classes/functions available  
### Server 
* rgs - dummy server  
### Platform 
* node_rng - integrated and exposes RNG to use 
* platform_math - has config like bets, autoplay, etc 
* base_slot_game - this is entry point for any platform 
* * executePlay - if we add any new action, we need to update the method 
* play_response_model - generic response for gameclient 
* responses_v2 - version 2 response requested by game client 

### Slot Engines  
#### Actions 
* CreateStops.StandardStops - Pick a random stop per reel and create a 2D grid of stops based on layout provided.  
* CreateStops.StandardStopsForNulls - Like in cascade, based on initial stops, select new stops for null stop positions. 
* CreateGrid.StandardGrid - Create 2D grid based on stops. 
* CreateGrid.WeightedSymbolGrid - Create a 2D grid by selecting a symbol for every position in grid based on layout provided.  
* CalculateWins.AddPays - Expects list of winlines and returns total sum 
* EvaluateWins.LineWins - Calculate line wins 
* RandomCondition.IsAvailable - Check if conditoin is available or not based on weights 
* ScatterSymbolCount.checkCondition - Check count of any symbol in board  
* SpinCondition.WinCondition - Triggers if there is a win 
* Triggerer.UpdateNextAction - Update next action to triggered feature 
* Triggerer.UpdateFeature - Update spin count in case of freespin.  

#### Evaluators 
* LineWinEvaluator - To evaluate line wins. Create its object or extend to use it.  

#### Utils 
* Cloner.CloneGrid - Use to clone stops, grids, etc. 
* Cloner.CloneObject - Use to clone any object. 
* RandomHelper.GetRandomFromList - Draw a random number and return an object from list provided based on weight.
* RandomHelper.GetObjectFromList - Based on random numer provided, return an object from list provided based on weight.

## Steps to Update slot-lib  
* Never update any class. Create a new class.
* Test and unit test the class in game.
* Get code reviewed by two senior members. 

### Code Review 
* Code has to be completely generic and tested with different params.
* Variable and Methods should have generic names. 
* Code should be easily readable. 
* Any complex algo/code should be properly commented. 
* ReadMe is updated with code details and version. 

