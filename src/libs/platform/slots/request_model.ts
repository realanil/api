import BigNumber from "bignumber.js";

export class RequestModel {

    public action :string = "";
    public stake :BigNumber = new BigNumber( 0);
    public cheat :number[];
    public state :any;
}