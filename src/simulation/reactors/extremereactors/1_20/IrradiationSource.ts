import { Vector3 } from "../../../Vector";
import { ControlRod } from "./ExtremeReactor";

export class IrradiationSource {
    worldPosition: Vector3;
    irradiationDirections = [new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)];
    linked: ControlRod | null = null;

    constructor(x: number, y: number, z: number) {
        this.worldPosition = new Vector3(x, y, z);
    }
};
