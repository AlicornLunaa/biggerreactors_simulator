import { Material } from "../../../Materials";
import { Vector3 } from "../../../Vector";
import { Config } from "./Config";
import { ControlRod } from "./ControlRod";
import EnergyConversion from "./EnergyConversion";
import { FuelProperties } from "./FuelProperties";
import { FuelRodMap } from "./FuelRodMap";
import { IrradiationSource } from "./IrradiationSource";
import { Variant } from "./Variant";

class IrradiationData {
    fuelUsage: number = 0;
    environmentEnergyAbsorption: number = 0;
    fuelEnergyAbsorption: number = 0;
    fuelAbsorbedRadiation: number = 0;

    public getEnvironmentHeatChange(environmentVolume: number) {
        return EnergyConversion.getTemperatureFromVolumeAndEnergy(environmentVolume, this.environmentEnergyAbsorption);
    }

    public getFuelHeatChange(fuelVolume: number) {
        return EnergyConversion.getTemperatureFromVolumeAndEnergy(fuelVolume, this.fuelEnergyAbsorption);
    }
};

class RadiationPacket {
    hardness: number = 0;
    intensity: number = 0;
};

export default class ExtremeReactor implements ReactorInterface {
    // Variables
    private width: number;
    private depth: number;
    private height: number;

    private blocks: Material[][][] = [];

    private mode: "passive"|"active" = "passive";
    private variant: Variant = Variant.Reinforced;
    private fuelProperties = FuelProperties.DEFAULT;

    private fuelToReactorHeatTransferCoefficient = 0;
    private reactorToCoolantSystemHeatTransferCoefficient = 0;
    private reactorHeatLossCoefficient = 0;

    private fertility = 1;
    private reactorHeat = 0;
    private coolantTemp = 0;

    private fuelCapacity = 11048;
    private fuelAmount = 0;
    private wasteAmount = 0;
    private fuelHeat = 0;
    private fuelUsedLastTick = 0;
    private radiationFuelUsage = 0;

    private energyCapacity = 1000000000;
    private storedEnergy = 0;
    private generatedLastTick = 0;

    private controlRods: ControlRod[] = [];
    private fuelRods = new FuelRodMap();

    // Constructor
    constructor(width: number, depth: number, height: number){
        this.width = width;
        this.depth = depth;
        this.height = height;

        for(let x = 0; x < width; x++){
            let slice: Material[][] = [];

            for(let y = 0; y < height; y++){
                let column: Material[] = [];

                for(let z = 0; z < depth; z++){
                    column.push(Material.EMPTY_MODERATOR);
                }

                slice.push(column);
            }
            
            this.blocks.push(slice);
        }

        this.reactorToCoolantSystemHeatTransferCoefficient = 0.6 * this.internalSurfaceArea();
        this.reactorHeatLossCoefficient = 0.001 * this.externalSurfaceArea();
        this.set_fertility(1);
    }

    // Functions
    public set_block(x: number, y: number, z: number, material: Material){
        this.blocks[x][y][z] = material;

        if(material == Material.FUEL_ROD){
            this.fuelRods.set_rod(x, y, z);

            for(let i = 0; i < this.controlRods.length; i++){
                if(this.controlRods[i].x == x && this.controlRods[i].z == z){
                    this.fuelRods.get_rod(x, y, z).linked = this.controlRods[i];
                    break;
                }
            }
        }
    }

    public add_control_rod(x: number, z: number, status: boolean){
        if(status){
            // Add new rod
            this.controlRods.push(new ControlRod(x, z));
        } else {
            // Remove rod
            for(let i = 0; i < this.controlRods.length; i++){
                if(this.controlRods[i].x == x && this.controlRods[i].z == z){
                    this.controlRods.splice(i, 1);
                    break;
                }
            }
        }
    }

    public update_fuel_rods(){
        this.fuelToReactorHeatTransferCoefficient = this.fuelRods.get_heat_transfer_rate(this.blocks);
        this.fuelCapacity = this.fuelRods.size() * 4000;
        
        let outerVolume = (this.width + 2) * (this.depth + 2) * (this.height + 2) - this.getReactorVolume();
        let partCount = outerVolume + this.fuelRods.size();
        this.energyCapacity = this.variant.partEnergyCapacity * partCount;
    }

    private internalSurfaceArea(){
        return  2 * (this.width * this.height + this.width * this.depth + this.height * this.depth);
    }

    private externalSurfaceArea(){
        return  2 * ((this.width + 2) * (this.height + 2) + (this.width + 2) * (this.depth + 2) + (this.height + 2) * (this.depth + 2));
    }

    private performIrradiation(active: boolean){
        if(!active)
            return;

        let source = this.fuelRods.get_next(this.height);

        if(source){
            this.performIrradiationFrom(source);
        }
    }

    private performIrradiationFrom(source: IrradiationSource){
        let res = this.radiate(source, this.fuelHeat, this.get_control_rod_count());

        if(res){
            this.fuelHeat += res.getFuelHeatChange(this.fuelRods.size());
            this.reactorHeat += res.getEnvironmentHeatChange(this.getReactorVolume());
            this.fuelUsedLastTick = res.fuelUsage;
        }
    }

    private transferHeatBetweenFuelAndReactor(){
        let temperatureDifferential = this.fuelHeat - this.reactorHeat;

        if (temperatureDifferential > 0.01) {
            let energyTransferred = temperatureDifferential * this.fuelToReactorHeatTransferCoefficient;
            let fuelVolEnergy = EnergyConversion.getEnergyFromVolumeAndTemperature(this.fuelRods.size(), this.fuelHeat) - energyTransferred;
            let reactorEnergy = EnergyConversion.getEnergyFromVolumeAndTemperature(this.getReactorVolume(), this.reactorHeat) + energyTransferred;

            this.fuelHeat = EnergyConversion.getTemperatureFromVolumeAndEnergy(this.fuelRods.size(), fuelVolEnergy);
            this.reactorHeat = EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getReactorVolume(), reactorEnergy);
        }
    }

    private transferHeatBetweenReactorAndCoolant() {
        let temperatureDifferential = this.reactorHeat - this.coolantTemp;

        if (temperatureDifferential > 0.01) {
            let energyTransferred = temperatureDifferential * this.reactorToCoolantSystemHeatTransferCoefficient;
            let reactorEnergy = EnergyConversion.getEnergyFromVolumeAndTemperature(this.getReactorVolume(), this.reactorHeat);

            if (this.mode == "passive") {
                energyTransferred *= 0.2;
                this.generateEnergy(energyTransferred * 0.5);
            } else {
                // energyTransferred -= this.getFluidContainer().onAbsorbHeat(energyTransferred, this._reactor.getVariant());
                // this.generatedLastTick = this.getFluidContainer().getLiquidVaporizedLastTick();
                throw new Error("Active reactors not implemented");
            }

            reactorEnergy -= energyTransferred;
            this.reactorHeat = EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getReactorVolume(), reactorEnergy);
        }
    }

    private getReactorVolume(){
        return this.width * this.depth * this.height;
    }

    private generateEnergy(rawEnergy: number){
        rawEnergy = rawEnergy * Config.COMMON.general.powerProductionMultiplier * Config.COMMON.reactor.reactorPowerProductionMultiplier * this.variant.energyGenerationEfficiency;
        this.storedEnergy += rawEnergy;
        this.generatedLastTick = rawEnergy;
    }

    private moderateRadiationForFuelRod(source: IrradiationSource, irradiationData: IrradiationData, radiation: RadiationPacket) {
        if (!source.linked) {
            return;
        }

        let baseAbsorption = (1.0 - (0.95 * Math.exp(-10 * Math.exp(-0.0022 * this.fuelHeat)))) * (1 - (radiation.hardness / this.fuelProperties.hardnessDivisor));
        let scaledAbsorption = Math.min(1, baseAbsorption * this.fuelProperties.absorptionCoefficient);
        let controlRodBonus = (1 - scaledAbsorption) * source.linked!.insertion * 0.5;
        let controlRodPenalty = scaledAbsorption * source.linked!.insertion * 0.5;

        let radiationAbsorbed = (scaledAbsorption + controlRodBonus) * radiation.intensity;
        let fertilityAbsorbed = (scaledAbsorption - controlRodPenalty) * radiation.intensity;

        let fuelModerationFactor = this.fuelProperties.moderationFactor;
        fuelModerationFactor += fuelModerationFactor * source.linked!.insertion + source.linked!.insertion;

        radiation.intensity = Math.max(0, radiation.intensity - radiationAbsorbed);
        radiation.hardness /= fuelModerationFactor;

        irradiationData.fuelEnergyAbsorption += radiationAbsorbed * EnergyConversion.ENERGY_PER_RADIATION_UNIT;
        irradiationData.fuelAbsorbedRadiation += fertilityAbsorbed;
    }

    private moderateRadiation(moderator: Material, data: IrradiationData, radiation: RadiationPacket) {
        let radiationAbsorbed = radiation.intensity * moderator.absorption * (1 - radiation.hardness);
        radiation.intensity = Math.max(0, radiation.intensity - radiationAbsorbed);
        radiation.hardness /= moderator.moderation;
        data.environmentEnergyAbsorption += moderator.efficiency * radiationAbsorbed * EnergyConversion.ENERGY_PER_RADIATION_UNIT;
    }

    public onIrradiation(fuelUsed: number) {
        if (!isFinite(fuelUsed) || isNaN(fuelUsed)) {
            return;
        }

        this.radiationFuelUsage += fuelUsed;
        if (this.radiationFuelUsage < 1) {
            return;
        }

        let fuelToConvert = Math.min(this.fuelAmount, this.radiationFuelUsage);
        if (fuelToConvert <= 0) {
            return;
        }

        this.radiationFuelUsage = Math.max(0, this.radiationFuelUsage - fuelToConvert);
        this.fuelAmount -= fuelToConvert;
        this.wasteAmount += fuelToConvert;
    }

    private radiate(source: IrradiationSource, fuelHeat: number, numControlRods: number){
        if(this.fuelAmount <= 0){
            return null;
        }

        let radiationPenaltyBase = Math.exp(-15 * Math.exp(-0.0025 * fuelHeat));
        let baseFuelAmount = this.fuelAmount + (this.wasteAmount / 100);
        let fuelReactivity = 1.05; // TODO: Fix this shit, convert to map like the mod
        let rawRadIntensity = baseFuelAmount * this.fuelProperties.fissionEventsPerFuelUnit;
        let scaledRadIntensity = Math.pow(rawRadIntensity, fuelReactivity);
        scaledRadIntensity = Math.pow(scaledRadIntensity / numControlRods, fuelReactivity) * numControlRods;

        let controlRodModifier = (100 - source.linked!.insertion) / 100;
        scaledRadIntensity = scaledRadIntensity * controlRodModifier;
        rawRadIntensity = rawRadIntensity * controlRodModifier;

        let effectiveRadIntensity = scaledRadIntensity * (1 + (-0.95 * Math.exp(-10 * Math.exp(-0.0012 * fuelHeat))));
        let radHardness = 0.2 + (0.8 * radiationPenaltyBase);
        let rawFuelUsage = (this.fuelProperties.fuelUnitsPerFissionEvent * rawRadIntensity / this.getFertilityModifier()) * Config.COMMON.general.fuelUsageMultiplier;

        let data = new IrradiationData();
        data.environmentEnergyAbsorption = 0;
        data.fuelAbsorbedRadiation = 0;
        data.fuelEnergyAbsorption = EnergyConversion.ENERGY_PER_RADIATION_UNIT * effectiveRadIntensity;

        let originCoord = source.worldPosition;
        let currentCoord = new Vector3(originCoord.x, originCoord.y, originCoord.z);
        let radPacket = new RadiationPacket();
        effectiveRadIntensity *= 0.25;

        for(let dir of source.irradiationDirections) {
            radPacket.hardness = radHardness;
            radPacket.intensity = effectiveRadIntensity;
            currentCoord = new Vector3(originCoord.x, originCoord.y, originCoord.z);
            let ttl = 4;

            while (ttl > 0 && radPacket.intensity > 0.0001) {
                ttl--;
                currentCoord.add(dir.x, dir.y, dir.z);

                if(currentCoord.x < 0 || currentCoord.y < 0 || currentCoord.z < 0 || currentCoord.x >= this.width || currentCoord.y >= this.height || currentCoord.z >= this.depth){
                    radPacket.intensity = 0;
                    continue;
                }

                let blockAtCurrentCoord = this.blocks[currentCoord.x][currentCoord.y][currentCoord.z];
                
                if(!blockAtCurrentCoord){
                    radPacket.intensity = 0;
                } else if(blockAtCurrentCoord.id == "biggerreactors:fuel_rod"){
                    this.moderateRadiationForFuelRod(source, data, radPacket);
                } else {
                    this.moderateRadiation(blockAtCurrentCoord, data, radPacket);
                }
            }
        }

        // Apply changes
        this.fertility += data.fuelAbsorbedRadiation;
        data.fuelAbsorbedRadiation = 0;

        // Inform fuelContainer
        this.onIrradiation(rawFuelUsage);
        data.fuelUsage = rawFuelUsage;

        return data;
    }

    private performRadiationDecay(isReactorActive: boolean) {
        let denominator = 20;

        if (!isReactorActive) {
            // Much slower decay when off
            denominator *= 200;
        }

        // Fertility decay, at least 0.1 rad/t, otherwise halve it every 10 ticks
        this.fertility = Math.max(0, this.fertility - Math.max(0.1, this.fertility / denominator));
    }

    private performPassiveHeatLoss() {
        let temperatureDifferential = this.reactorHeat - 20;

        if (temperatureDifferential > 0.000001) {
            let energyLost = Math.max(1, temperatureDifferential * this.reactorHeatLossCoefficient);
            let reactorNewEnergy = Math.max(0, EnergyConversion.getEnergyFromVolumeAndTemperature(this.getReactorVolume(), this.reactorHeat) - energyLost);
            this.reactorHeat = EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getReactorVolume(), reactorNewEnergy);
        }
    }

    private getFertilityModifier() {
        if (this.fertility <= 1) {
            return 1;
        } else {
            return (Math.log10(this.fertility) + 1);
        }
    }

    private set_fertility(value: number){
        if(!isFinite(value) || isNaN(value)){
            this.fertility = 1;
        } else {
            this.fertility = Math.max(this.fertility, 0);
        }
    }

    // Interface
    tick(active: boolean): void {
        this.performIrradiation(active);
        this.performRadiationDecay(active);

        this.transferHeatBetweenFuelAndReactor();
        this.transferHeatBetweenReactorAndCoolant();
        this.performPassiveHeatLoss();

        this.reactorHeat = Math.max(this.reactorHeat, 0);
        this.fuelHeat = Math.max(this.fuelHeat, 0);

        if(!active){
            this.fuelUsedLastTick = 0;
        }
    }

    refuel(): void {
        this.fuelAmount = this.fuelCapacity;
        this.wasteAmount = 0;
        this.storedEnergy = 0;
    }

    get_width(): number { return this.width; }
    get_depth(): number { return this.depth; }
    get_height(): number { return this.height; }

    get_generated(): number { return this.generatedLastTick; }
    get_energy(): number { return this.storedEnergy; }
    get_energy_capacity(): number { return this.energyCapacity; }

    get_stack_temperature(): number { return this.reactorHeat; }
    get_fuel_temperature(): number { return this.fuelHeat; }
    get_fuel_burned(): number { return this.fuelUsedLastTick; }
    get_fuel(): number { return this.fuelAmount; }
    get_fuel_capacity(): number { return this.fuelCapacity; }
    get_waste(): number { return this.wasteAmount; }

    get_fertility(): number {
        // Extreme reactors uses diff method
        if (this.fuelAmount + this.wasteAmount <= 0) {
            return 0;
        } else {
            return this.fuelAmount / (this.fuelAmount + this.wasteAmount);
        }
    }

    set_control_rod(index: number, insertion: number): void { this.controlRods[index].insertion = insertion; }
    get_control_rod(index: number): number { return this.controlRods[index].insertion; }
    get_control_rod_count(): number { return this.controlRods.length; }
}