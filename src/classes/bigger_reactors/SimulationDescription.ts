import { Material } from "../Materials";

class SimulationDescription {

    x: number;
    y: number;
    z: number;

    moderators: Material[][][];
    manifoldLocations: boolean[][][];
    manifoldCount: number;

    controlRodLocations: boolean[][];
    controlRodCount: number;

    passivelyCooled: boolean;
    ambientTemperature: number;

    constructor(){
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.moderators = [];
        this.manifoldLocations = [];
        this.manifoldCount = 0;

        this.controlRodLocations = [];
        this.controlRodCount = 0;

        this.passivelyCooled = false;
        this.ambientTemperature = 273.15;
    }
    
    public setSize(x: number, y: number, z: number) {
        if (x <= 0 || y <= 0 || z <= 0) return;

        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    public setModeratorProperties(x: number, y: number, z: number, properties: Material) {
        if (this.moderators == null) return;
        if (x < 0 || x >= this.moderators.length || y < 0 || y >= this.moderators[0].length || z < 0 || z >= this.moderators[0][0].length) return;

        this.moderators[x][y][z] = properties;
    }
    
    public setControlRod(x: number, z: number, isControlRod: boolean) {
        if (this.controlRodLocations == null) return;
        if (x < 0 || x >= this.controlRodLocations.length || z < 0 || z >= this.controlRodLocations[0].length) return;
        if (this.controlRodLocations[x][z] != isControlRod) {
            this.controlRodCount += isControlRod ? 1 : -1;
        }
        this.controlRodLocations[x][z] = isControlRod;
    }
    
    public setManifold(x: number, y: number, z: number, manifold: boolean) {
        if (this.manifoldLocations == null) return;
        if (x < 0 || x >= this.manifoldLocations.length || y < 0 || y >= this.manifoldLocations[0].length || z < 0 || z >= this.manifoldLocations[0][0].length) return;
        if (this.manifoldLocations[x][y][z] != manifold) {
            this.manifoldCount += manifold ? 1 : -1;
        }
        this.manifoldLocations[x][y][z] = manifold;
    }

}

export default SimulationDescription;