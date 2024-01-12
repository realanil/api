import BigNumber from "bignumber.js";
import { SlotState } from "../../../libs/engine/slots/models/slot_state_model";

export class SlotocrashState extends SlotState {

    public isCollected :boolean = false;
    public collectedWin :BigNumber = new BigNumber(0);
}
