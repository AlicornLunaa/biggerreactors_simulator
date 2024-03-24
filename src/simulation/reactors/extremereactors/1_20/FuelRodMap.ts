import { Material } from "../../../Materials";
import { Vector3 } from "../../../Vector";
import { IrradiationSource } from "./IrradiationSource";

export class FuelRodMap {
    // Variables
    public fuelRods: IrradiationSource[] = [];
    public map: { [key: string]: number; } = {}; // Map coordinates to an index

    private currentSlice = 0;
    private currentIndex = 0;
    private verticalSlices: { [key: number]: IrradiationSource[] } = {};

    // Functions
    public set_rod(x: number, y: number, z: number) {
        let src = new IrradiationSource(x, y, z);

        if(!this.verticalSlices[y]){
            this.verticalSlices[y] = [];
        }

        this.verticalSlices[y].push(src);
        this.fuelRods.push(src);
        this.map[`${x} ${y} ${z}`] = this.fuelRods.length - 1;
        return src;
    }

    public get_rod(x: number, y: number, z: number) {
        return this.fuelRods[this.map[`${x} ${y} ${z}`]];
    }

    public size() { return this.fuelRods.length; }

    public get_heat_transfer_rate(world: Material[][][]) {
        let rate = 0;

        for (let rod of this.fuelRods) {
            let rodPosition = rod.worldPosition;
            let heatTransferRate = 0;

            for (let dir of rod.irradiationDirections) {
                let targetPosition = new Vector3(rodPosition.x + dir.x, rodPosition.y + dir.y, rodPosition.z + dir.z);
                
                // Edge-case for casings
                if (targetPosition.x < 0 || targetPosition.y < 0 || targetPosition.z < 0 || targetPosition.x >= world.length || targetPosition.y >= world[0].length || targetPosition.z >= world[0][0].length) {
                    heatTransferRate += 0.6;
                    continue;
                }
                
                let state = world[targetPosition.x][targetPosition.y][targetPosition.z];

                if (state.id == "minecraft:air") {
                    heatTransferRate += 0.05;
                    continue;
                }

                if (state.id != "biggerreactors:fuel_rod") {
                    heatTransferRate += state.conductivity;
                }
            }

            rate += heatTransferRate;
        }

        return rate;
    }

    public get_next(height: number) {
        if (this.fuelRods.length == 0) {
            return null;
        }

        let src = this.verticalSlices[this.currentSlice][this.currentIndex];
        
        if(++this.currentIndex >= this.verticalSlices[this.currentSlice].length){
            this.currentIndex = 0;
            this.currentSlice = (this.currentSlice + 1) % height;
        }

        return src;
    }
}
