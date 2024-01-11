import BigNumber from "bignumber.js";

export class RequestModel {

    public action:string = "";
    public stake:BigNumber = new BigNumber( 0);
    public state:any;
    public id?:string = "";
    public cheat?:number[];
}
