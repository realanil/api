import BigNumber from "bignumber.js";

export class PayoutTester{

    public payouts :PayoutDetails[] = [];
    public totalBet :BigNumber = new BigNumber(0);
    public totalWin :BigNumber = new BigNumber(0);
    public winningSpins :number = 0;
    public totalSpins :number = 0;

    public startTesting( spinsCount :number = 100000000) {
        this.totalSpins = spinsCount;
    }

    protected updateTotalBetAndWin( bet :BigNumber, win :BigNumber) {
        this.totalBet = this.totalBet.plus(bet);
        this.totalWin = this.totalWin.plus(win);
        if ( win.isGreaterThan( new BigNumber(0))) {
            this.winningSpins++;
        }
    }

    protected getGameRTP() :BigNumber {
        return this.totalWin.dividedBy( this.totalBet);
    }

    protected updateKeyCount( key :string) {
        for (let i:number=0; i<this.payouts.length; i++ ){
            if ( this.payouts[i].key == key ) {
                this.payouts[i].count += 1;
                return;
            }
        }

        this.createPayoutKey(key, "", 999999999);
        this.updateKeyCount(key);
    }

    protected updatePayout( key :string, payout :BigNumber) {

        if ( payout.isLessThanOrEqualTo(new BigNumber(0)) ){
            return;
        }

        for (let i:number=0; i<this.payouts.length; i++ ){
            if ( this.payouts[i].key == key ) {
                this.payouts[i].payout = this.payouts[i].payout.plus( payout);
                this.payouts[i].count += 1;
                return;
            }
        }

        this.createPayoutKey(key, "", 999999999);
        this.updateKeyCount(key);
        
    }

    protected createPayoutKey(key :string, group :string, priority :number) {
        for (let i:number=0; i<this.payouts.length; i++ ){
            if ( this.payouts[i].key == key ) {
                return;
            }
        }

        const payout :PayoutDetails = new PayoutDetails();
        payout.key = key;
        payout.count = 0;
        payout.group = group;
        payout.priority = priority;
        payout.payout = new BigNumber(0);
        this.payouts.push(payout);
    }

    protected printReport() {

        this.payouts.sort((a,b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))        
        // fileName += ".txt";
        // try {
        //     PrintStream out = new PrintStream(new FileOutputStream(fileName));
        //     System.setOut(out);
        // } catch (FileNotFoundException e) {
        //     e.printStackTrace();
        // }

        console.log("Total Spins," + this.totalSpins);
        console.log("Total Bet," + this.totalBet);
        console.log("Total Win," + this.totalWin);
        console.log("Winning Spins," + this.winningSpins);
        console.log("");

        if (this.payouts.length == 0) {
            return;
        }

        let group :string = this.payouts[0].group;
        for (let i:number=0; i<this.payouts.length; i++ ){
            const pay :PayoutDetails = this.payouts[i];
            if ( group !== pay.group ) {
                console.log("");
                group = pay.group;
            }

            if ( pay.payout.isGreaterThan( new BigNumber(0)) ){
                console.log( pay.key + " , count : " + pay.count + ", payout : " + pay.payout );
            } else {
                if (pay.count > 0) {
                    console.log(pay.key + ", count : " + pay.count );
                }
            }
        }
    }

    protected printProgressReport(spinsPlayed :number) {
        if (spinsPlayed > 10 && spinsPlayed % 50000 == 0) {
            console.log(spinsPlayed + " RTP: " + this.getGameRTP());
        }
    }
}

class PayoutDetails{
    public key :string;
    public group :string;
    public count :number;
    public payout :BigNumber;
    public priority :number;
}
