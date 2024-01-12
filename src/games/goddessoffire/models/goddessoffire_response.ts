import { PlatformMath } from "../../../libs/platform/base/platform_math";
import { PlayResponseV3Model } from "../../../libs/platform/slots/responses_v3";
import { GoddessOfFireState } from "./goddessoffire_state";

export class GoddessOfFireResponseModel extends PlayResponseV3Model {

    constructor( version:string, name:string, math:PlatformMath, state:GoddessOfFireState ) {
        super( version, name, math, state);
    }
}
