// https://github.com/BiggerSeries/BiggerReactors/blob/master/src/main/java/net/roguelogix/biggerreactors/multiblocks/reactor/simulation/base/BaseReactorSimulation.java

import Battery from "./Battery";
import Config from "./Config";
import ControlRod from "./ControlRod";
import CoolantTank from "./CoolantTank";
import FuelTank from "./FuelTank";
import HeatBody from "./HeatBody";
import { Material } from "../../Materials";
import SimulationDescription from "./SimulationDescription";
import { AxisDirections, CardinalDirections } from "../../Vector";

abstract class BaseReactorSimulation {
    x: number;
    y: number;
    z: number;

    defaultModerator: Material;
    moderatorProperties: (Material | null)[][][] = [];
    controlRodsXZ: (ControlRod | null)[][] = [];
    controlRods: ControlRod[] = [];

    fuelToCasingRFKT: number;
    fuelToManifoldSurfaceArea: number;
    stackToCoolantSystemRFKT: number;
    casingToAmbientRFKT: number;

    fuelHeat: HeatBody = new HeatBody();
    stackHeat: HeatBody = new HeatBody();
    ambientHeat: HeatBody = new HeatBody();

    battery: Battery | null;
    coolantTank: CoolantTank | null;
    output: HeatBody;
    fuelTank: FuelTank;
    fuelFertility: number = 1;

    constructor(desc: SimulationDescription){
        this.x = desc.x;
        this.y = desc.y;
        this.z = desc.z;
        this.defaultModerator = desc.defaultModeratorProperties;

        if (desc.passivelyCooled) {
            this.output = this.battery = new Battery((((desc.x + 2) * (desc.y + 2) * (desc.z + 2)) - (desc.x * desc.y * desc.z)) * Config.Reactor.PassiveBatteryPerExternalBlock);
            this.coolantTank = null;
        } else {
            let perSideCapacity = this.controlRods.length * desc.y * Config.Reactor.CoolantTankAmountPerFuelRod;
            perSideCapacity += desc.manifoldCount * Config.Reactor.CoolantTankAmountPerFuelRod;
            this.output = this.coolantTank = new CoolantTank(perSideCapacity, desc.defaultModeratorProperties);
            this.battery = null;
        }
        
        this.moderatorProperties = [];
        for (let i = 0; i < desc.x; i++) {
            let ySlice: (Material | null)[][] = [];

            for (let j = 0; j < desc.y; j++) {
                let zSlice: (Material | null)[] = [];

                for (let k = 0; k < desc.z; k++) {
                    let newProperties: Material | null = desc.moderatorProperties[i][j][k];

                    if (desc.manifoldLocations[i][j][k]) {
                        newProperties = this.coolantTank!.moderator;
                    }
                    if (newProperties == null) {
                        newProperties = this.defaultModerator;
                    }

                    zSlice.push(newProperties);
                }

                ySlice.push(zSlice);
            }

            this.moderatorProperties.push(ySlice);
        }

        this.controlRodsXZ = [];
        for(let i = 0; i < desc.x; i++){
            let slice: (ControlRod | null)[] = [];
            
            for(let j = 0; j < desc.z; j++){

                if(desc.controlRodLocations[i][j]){
                    let rod = new ControlRod(i, j);
                    slice.push(rod);
                    this.controlRods.push(rod);

                    for(let k = 0; k < desc.y; k++){
                        this.moderatorProperties[i][k][j] = null;
                    }
                } else {
                    slice.push(null);
                }
            }

            this.controlRodsXZ.push(slice);
        }
    
        this.fuelTank = new FuelTank(Config.Reactor.PerFuelRodCapacity * this.controlRods.length * desc.y);
        
        let fuelToCasingRFKT = 0;
        let fuelToManifoldSurfaceArea = 0;
        for (let controlRod of this.controlRods) {
            for (let i = 0; i < desc.y; i++) {
                for (let direction of CardinalDirections) {
                    if (controlRod.x + direction.x < 0 || controlRod.x + direction.x >= this.x || controlRod.y + direction.y < 0 || controlRod.y + direction.y >= this.z) {
                        fuelToCasingRFKT += Config.Reactor.CasingHeatTransferRFMKT;
                        continue;
                    }
                    let properties = this.moderatorProperties[controlRod.x + direction.x][i][controlRod.y + direction.y];
                    if (properties != null) {
                        if (properties instanceof CoolantTank) {
                            fuelToManifoldSurfaceArea++;
                        } else {
                            // normal block
                            fuelToCasingRFKT += properties.conductivity;
                        }
                    }
                }
            }
        }
        fuelToCasingRFKT *= Config.Reactor.FuelToStackRFKTMultiplier;
        
        let stackToCoolantSystemRFKT = 2 * (this.x * this.y + this.x * this.z + this.z * this.y);
        
        
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                for (let k = 0; k < this.z; k++) {
                    let properties = this.moderatorProperties[i][j][k];
                    if (properties instanceof CoolantTank) {
                        // its a manifold here, need to consider its surface area
                        for (let axisDirection of AxisDirections) {
                            let neighborX = i + axisDirection.x;
                            let neighborY = j + axisDirection.y;
                            let neighborZ = k + axisDirection.z;
                            if (neighborX < 0 || neighborX >= this.x ||
                                        neighborY < 0 || neighborY >= this.y ||
                                        neighborZ < 0 || neighborZ >= this.z) {
                                // OOB, so its a casing we are against here, this counts against us
                                stackToCoolantSystemRFKT--;
                                continue;
                            }
                            let neighborProperties = this.moderatorProperties[neighborX][neighborY][neighborZ];
                            // should a fuel rod add to surface area? it does right now.
                            if (!(neighborProperties instanceof CoolantTank)) {
                                stackToCoolantSystemRFKT++;
                            }
                        }
                    }
                }
            }
        }
        stackToCoolantSystemRFKT *= Config.Reactor.StackToCoolantRFMKT;
        
        if (desc.passivelyCooled) {
            stackToCoolantSystemRFKT *= Config.Reactor.PassiveCoolingTransferEfficiency;
        }
        
        this.casingToAmbientRFKT = 2 * ((this.x + 2) * (this.y + 2) + (this.x + 2) * (this.z + 2) + (this.z + 2) * (this.y + 2)) * Config.Reactor.StackToAmbientRFMKT;
        this.fuelToCasingRFKT = fuelToCasingRFKT;
        this.fuelToManifoldSurfaceArea = fuelToManifoldSurfaceArea;
        this.stackToCoolantSystemRFKT = stackToCoolantSystemRFKT;
        
        this.fuelHeat.rfPerKelvin = this.controlRods.length * this.y * Config.Reactor.RodFEPerUnitVolumeKelvin;
        this.stackHeat.rfPerKelvin = this.x * this.y * this.z * Config.Reactor.RodFEPerUnitVolumeKelvin;
        
        this.ambientHeat.isInfinite = true;
        this.ambientHeat.temperature = desc.ambientTemperature;
        this.stackHeat.temperature = desc.ambientTemperature;
        this.fuelHeat.temperature = desc.ambientTemperature;

        if (this.battery != null) {
            this.battery.temperature = desc.ambientTemperature;
        }
    }
    
    public abstract radiate(): number;

    public startNextRadiate(){}

    public tick(active: boolean) {
        let toBurn = 0;
        if (active) {
            toBurn = this.radiate();
        } else {
            this.fuelTank.burn(0);
        }

        // decay fertility, RadiationHelper.tick in old BR, this is copied, mostly
        let denominator = Config.Reactor.FuelFertilityDecayDenominator;
        if (!active) {
            // Much slower decay when off
            denominator *= Config.Reactor.FuelFertilityDecayDenominatorInactiveMultiplier;
        }
        
        // Fertility decay, at least 0.1 rad/t, otherwise halve it every 10 ticks
        this.fuelFertility = Math.max(0, this.fuelFertility - Math.max(Config.Reactor.FuelFertilityMinimumDecay, this.fuelFertility / denominator));
        
        this.fuelHeat.transferWith(this.stackHeat, this.fuelToCasingRFKT + this.fuelToManifoldSurfaceArea * (this.coolantTank == null ? this.defaultModerator.conductivity : this.coolantTank.moderator!.conductivity));
        this.output.transferWith(this.stackHeat, this.stackToCoolantSystemRFKT);
        this.stackHeat.transferWith(this.ambientHeat, this.casingToAmbientRFKT);
        
        if(active){
            this.startNextRadiate();
            this.fuelTank.burn(toBurn);
        }
    }

    public fertility(){
        if(this.fuelFertility <= 1){
            return 1;
        }

        return Math.log10(this.fuelFertility) + 1;
    }

}

export default BaseReactorSimulation;