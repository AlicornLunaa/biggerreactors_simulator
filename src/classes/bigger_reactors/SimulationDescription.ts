import { Material } from "../Materials";

class SimulationDescription {

    x: number = 0;
    y: number = 0;
    z: number = 0;

    defaultModeratorProperties: Material = Material.EMPTY_MODERATOR;
    moderatorProperties: Material[][][] = [];
    manifoldLocations: boolean[][][] = [];
    manifoldCount: number = 0;

    controlRodLocations: boolean[][] = [];
    controlRodCount: number = 0;

    passivelyCooled: boolean = true;
    ambientTemperature: number = 273.15;

    constructor(){}
    
    public setSize(x: number, y: number, z: number) {
        if (x <= 0 || y <= 0 || z <= 0) return;

        this.x = x;
        this.y = y;
        this.z = z;

        this.moderatorProperties = [];
        this.manifoldLocations = [];
        this.manifoldCount = 0;

        for(let i = 0; i < x; i++){
            let ySliceModerators: Material[][] = [];
            let ySliceManifolds: boolean[][] = [];

            for(let j = 0; j < y; j++){
                let zSliceModerators: Material[] = [];
                let zSliceManifolds: boolean[] = [];

                for(let k = 0; k < z; k++){
                    zSliceModerators.push(this.defaultModeratorProperties);
                    zSliceManifolds.push(false);
                }

                ySliceModerators.push(zSliceModerators);
                ySliceManifolds.push(zSliceManifolds);
            }

            this.moderatorProperties.push(ySliceModerators)
            this.manifoldLocations.push(ySliceManifolds)
        }

        this.controlRodLocations = [];
        this.controlRodCount = 0;

        for(let i = 0; i < x; i++){
            let slice: boolean[] = [];

            for(let k = 0; k < z; k++){
                slice.push(false);
            }

            this.controlRodLocations.push(slice);
        }
    }
    
    public setModeratorProperties(x: number, y: number, z: number, properties: Material) {
        if (this.moderatorProperties == null) return;
        if (x < 0 || x >= this.moderatorProperties.length || y < 0 || y >= this.moderatorProperties[0].length || z < 0 || z >= this.moderatorProperties[0][0].length) return;

        this.moderatorProperties[x][y][z] = properties;
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