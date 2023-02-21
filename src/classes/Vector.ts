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

    public add(x: number, y: number, z: number){
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    public floor(){
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
    }

    public sub(other: Vector3){
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    public length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize(){
        let mag = this.length();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
    }

    public maxComponent(){
        return Math.max(this.x, Math.max(this.y, this.z));
    }

    public mul(val: number){
        this.x *= val;
        this.y *= val;
        this.z *= val;
        return this;
    }

    public divVec(other: Vector3){
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
    }

    public set(other: Vector3){
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    public absolute(){
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
    }

    public get(index: number){
        if(index == 0){
            return this.x;
        } else if(index == 1){
            return this.y;
        } else {
            return this.z;
        }
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