class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const CardinalDirections = [
    new Vector2(-1,  0),
    new Vector2( 1,  0),
    new Vector2( 0,  1),
    new Vector2( 0, -1)
];

const AxisDirections = [
    new Vector3(+1, +0, +0),
    new Vector3(-1, +0, +0),
    new Vector3(+0, +1, +0),
    new Vector3(+0, -1, +0),
    new Vector3(+0, +0, +1),
    new Vector3(+0, +0, -1)
];

export { Vector2, Vector3, CardinalDirections, AxisDirections };