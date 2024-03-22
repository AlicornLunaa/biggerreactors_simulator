import { Vector3 } from "../../../Vector";
import { BlockPos } from "./BlockPos";

export default interface IIrradiationSource {
    getControlRodInsertionRatio(): number;
    getIrradiationDirections(): Vector3[];
    isLinked(): boolean;
    getWorldPosition(): BlockPos;
}