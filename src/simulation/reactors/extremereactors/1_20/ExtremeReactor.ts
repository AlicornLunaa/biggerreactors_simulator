import { Material } from "../../../Materials";
import { Vector3 } from "../../../Vector";
import { Config } from "./Config";
import EnergyConversion from "./EnergyConversion";

class Variant {
    // Types
    public static readonly Basic = new Variant("basic", 0.9, 0.1, 0.5, 0, 10000, 0.8, 50000, 0, 0, 0);
    public static readonly Reinforced = new Variant("reinforced", 0.75, 0.15, 0.75, 0.95, 30000, 0.85, 5000000, 1000, 200000, 0.85);

    // Properties
    name: string;
    radiationAttenuation: number;
    residualRadiationAttenuation: number;
    solidFuelConversionEfficiency: number;
    fluidFuelConversionEfficiency: number;
    partEnergyCapacity: number;
    energyGenerationEfficiency: number;
    maxEnergyExtractionRate: number;
    partFluidCapacity: number;
    maxFluidCapacity: number;
    vaporGenerationEfficiency: number;

    // Constructor
    private constructor(name: "basic"|"reinforced", radAttenuation: number, residRadAttenuation: number, solidEfficiency: number, fluidEfficiency: number,
            partEnergyCapacity: number, energyGenEff: number, maxEnergyExtract: number, partFluidCap: number, maxFluidCap: number, vaporGenEff: number){
        this.name = name;
        this.radiationAttenuation = radAttenuation;
        this.residualRadiationAttenuation = residRadAttenuation;
        this.solidFuelConversionEfficiency = solidEfficiency;
        this.fluidFuelConversionEfficiency = fluidEfficiency;
        this.partEnergyCapacity = partEnergyCapacity;
        this.energyGenerationEfficiency = energyGenEff;
        this.maxEnergyExtractionRate = maxEnergyExtract;
        this.partFluidCapacity = partFluidCap;
        this.maxFluidCapacity = maxFluidCap;
        this.vaporGenerationEfficiency = vaporGenEff;
    }

    // Functions
    public solidSourceAmountToReactantAmount(originalAmount: number) { return Math.floor(originalAmount * this.solidFuelConversionEfficiency); }
    public reactantAmountToSolidSourceAmount(originalAmount: number) { return Math.floor(originalAmount / this.solidFuelConversionEfficiency); }
    public fluidSourceAmountToReactantAmount(originalAmount: number) { return Math.floor(originalAmount * this.fluidFuelConversionEfficiency); }
    public reactantAmountToFluidSourceAmount(originalAmount: number) { return Math.floor(originalAmount / this.fluidFuelConversionEfficiency); }
};

class FuelProperties {
    static readonly DEFAULT: FuelProperties = { moderationFactor: 1.5, absorptionCoefficient: 0.5, hardnessDivisor: 1.0, fissionEventsPerFuelUnit: 0.01, fuelUnitsPerFissionEvent: 0.0007 };
    static readonly INVALID: FuelProperties = { moderationFactor: 1, absorptionCoefficient: 0, hardnessDivisor: 1.0, fissionEventsPerFuelUnit: 0, fuelUnitsPerFissionEvent: 0 };

    moderationFactor: number;
    absorptionCoefficient: number;
    hardnessDivisor: number;
    fissionEventsPerFuelUnit: number;
    fuelUnitsPerFissionEvent: number;

    constructor(modFac: number, absCoeff: number, hard: number, fissionEvents: number, fuelUnits: number) {
        this.moderationFactor = modFac;
        this.absorptionCoefficient = absCoeff;
        this.hardnessDivisor = hard;
        this.fissionEventsPerFuelUnit = fissionEvents;
        this.fuelUnitsPerFissionEvent = fuelUnits;
    }
};

class ControlRod {
    x: number;
    z: number;
    insertion: number = 0;

    constructor(x: number, z: number) {
        this.x = x;
        this.z = z;
    }
};

class IrradiationSource {
    worldPosition: Vector3;
    irradiationDirections = [ new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1) ];
    linked: ControlRod|null = null;

    constructor(x: number, y: number, z: number) {
        this.worldPosition = new Vector3(x, y, z);
    }
};

class FuelRodMap {
    public fuelRods: IrradiationSource[] = [];
    public map: { [key: string]: number } = {}; // Map coordinates to an index

    private radiationPos = new Vector3(0, 0, 0);

    public set_rod(x: number, y: number, z: number){
        this.fuelRods.push(new IrradiationSource(x, y, z))
        this.map[`${x} ${y} ${z}`] = this.fuelRods.length - 1;
    }

    public get_rod(x: number, y: number, z: number){
        return this.fuelRods[this.map[`${x} ${y} ${z}`]];
    }

    public size(){ return this.fuelRods.length; }

    public get_heat_transfer_rate(world: Material[][][]){
        let rate = 0;

        for(let rod of this.fuelRods){
            let rodPosition = rod.worldPosition;
            let heatTransferRate = 0;

            for (let dir of rod.irradiationDirections) {
                let targetPosition = new Vector3(rodPosition.x + dir.x, rodPosition.y + dir.y, rodPosition.z + dir.z);
                
                // Edge-case for casings
                if(targetPosition.x < 0 || targetPosition.y < 0 || targetPosition.z < 0 || targetPosition.x >= world.length || targetPosition.y >= world[0].length || targetPosition.z >= world[0][0].length){
                    heatTransferRate += 0.6;
                    continue;
                }

                let state = world[targetPosition.x][targetPosition.y][targetPosition.z];

                if(state.id == "minecraft:air") {
                    heatTransferRate += 0.05;
                    continue;
                }

                if(state.id != "biggerreactors:fuel_rod") {
                    heatTransferRate += state.conductivity;
                }
            }

            rate += heatTransferRate;
        }

        return rate;
    }

    public get_next(width: number, depth: number, height: number){
        if(this.fuelRods.length == 0){
            return null;
        }

        let current: number|undefined = this.map[`${this.radiationPos.x} ${this.radiationPos.y} ${this.radiationPos.z}`];
        
        //! This shits so fucked
        while(!current) {
            if(++this.radiationPos.z >= depth){
                this.radiationPos.z = 0;
                
                if(++this.radiationPos.x >= width){
                    this.radiationPos.x = 0;

                    if(++this.radiationPos.y >= height){
                        this.radiationPos.y = 0;
                    }
                }
            }

            current = this.map[`${this.radiationPos.x} ${this.radiationPos.y} ${this.radiationPos.z}`];
        }

        return this.get_rod(this.radiationPos.x, this.radiationPos.y, this.radiationPos.z);
    }
};

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

    private fuelCapacity = 100000;
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

            for(let z = 0; z < depth; z++){
                let column: Material[] = [];

                for(let y = 0; y < height; y++){
                    column.push(Material.EMPTY_MODERATOR);
                }
                
                slice.push(column);
            }

            this.blocks.push(slice);
        }

        this.reactorToCoolantSystemHeatTransferCoefficient = 0.6 * this.internalSurfaceArea();
        this.reactorHeatLossCoefficient = 0.001 * this.externalSurfaceArea();
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

            this.update_fuel_rods();
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

    private update_fuel_rods(){
        this.fuelToReactorHeatTransferCoefficient = this.fuelRods.get_heat_transfer_rate(this.blocks);
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

        let source = this.fuelRods.get_next(this.width, this.depth, this.height);

        if(source){
            this.performIrradiationFrom(source);
        }
    }

    private performIrradiationFrom(source: IrradiationSource){
        let res = this.radiate(source, this.fuelHeat, this.get_control_rod_count());

        if(res){
            this.fuelHeat += res.getFuelHeatChange(this.get_control_rod_count());
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

    private moderateRadiation(source: IrradiationSource, irradiationData: IrradiationData, radiation: RadiationPacket) {
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
                this.moderateRadiation(source, data, radPacket);
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

    // Interface
    tick(active: boolean): void {
        this.performIrradiation(active);
        this.performRadiationDecay(active);

        this.transferHeatBetweenFuelAndReactor();
        this.transferHeatBetweenReactorAndCoolant();
        this.performPassiveHeatLoss();

        this.reactorHeat = Math.max(this.reactorHeat, 0);
        this.fuelHeat = Math.max(this.fuelHeat, 0);
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
    get_fertility(): number { return this.fertility; }

    set_control_rod(index: number, insertion: number): void { this.controlRods[index].insertion = insertion; }
    get_control_rod(index: number): number { return this.controlRods[index].insertion; }
    get_control_rod_count(): number { return this.controlRods.length; }
}