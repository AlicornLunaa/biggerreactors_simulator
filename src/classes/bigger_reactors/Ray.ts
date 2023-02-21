import { Vector3 } from "../Vector";

class RayStep {
    static rays: RayStep[][] = [];

    offset: Vector3;
    length: number;

    constructor(offset: Vector3, length: number){
        this.offset = offset;
        this.length = length;
    }
}

export default RayStep;