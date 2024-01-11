import BigNumber from "bignumber.js";

export class GameState {
    public name : string = "";
    public version : string = "";
    public error: string = "";
    public gameStatus : GameStatus = new GameStatus();
}

export class GameStatus {
    public action : string = "";
    public nextAction : string[] = ["spin"];
    public totalBet : BigNumber = new BigNumber(0);
    public stakeValue : BigNumber = new BigNumber(0);
    public totalWin : BigNumber = new BigNumber(0);
    public currentWin : BigNumber = new BigNumber(0);
}
