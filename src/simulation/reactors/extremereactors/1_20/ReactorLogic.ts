import IReactorMachine from "./IReactorMachine";
import WideEnergyBuffer from "./WideEnergyBuffer";
import { ReactorPartType } from "./ReactorPartType";
import EnergyConversion from "./EnergyConversion";
import { Config } from "./Config";
import IrradiationData from "./IrradiationData";
import RadiationPacket from "./RadiationPacket";
import IFuelContainer from "./IFuelContainer";
import IIrradiationSource from "./IIrradiationSource";
import { Vector3 } from "../../../Vector";

export default class ReactorLogic implements ReactorInterface {
    // Static variables
    private static readonly PASSIVE_COOLING_POWER_EFFICIENCY = 0.5;
    private static readonly PASSIVE_COOLING_TRANSFER_EFFICIENCY = 0.2;
    
    // Variable
    private readonly reactor: IReactorMachine;
    private readonly energyBuffer: WideEnergyBuffer;
    private fertility = 1;

    private fuelUsage = 0;
    private fluidGeneratedLastTick = 0;
    private energyGeneratedLastTick = 0;

    // Constructor
    constructor(reactor: IReactorMachine, energyBuffer: WideEnergyBuffer){
        this.reactor = reactor;
        this.energyBuffer = energyBuffer;
        this.setFertility(1);
    }

    // Functions
    public getFertility(){ return this.fertility; }
    public setFertility(f: number){ this.fertility = ((isNaN(f) || !isFinite(f)) ? 1 : Math.max(f, 0)); }

    public update(){
        let reactorHeat = this.getReactorHeat();

        if(isNaN(reactorHeat.value)){
            reactorHeat.set(0);
        }

        let startingReactorHeat = reactorHeat.value;
        let startingEnergy = this.energyBuffer.getEnergyStored();

        this.performIrradiation();
        this.performRadiationDecay(this.reactor.isMachineActive());

        let reactantsChanged = this.reactor.performRefuelingCycle() || this.reactor.performInputCycle();

        this.transferHeatBetweenFuelAndReactor();
        this.transferHeatBetweenReactorAndCoolant();
        this.performPassiveHeatLoss();
        
        reactorHeat.resetIfNegative();
        this.getFuelHeat().resetIfNegative();

        this.reactor.performOutputCycle();

        return reactantsChanged || startingReactorHeat != reactorHeat.value || startingEnergy != this.energyBuffer.getEnergyStored();
    }
    
    public reset(){ this.setFertility(1); }

    private getFuelHeat() { return this.reactor.getFuelHeat(); }
    private getReactorHeat() { return this.reactor.getEnvironment().getReactorHeat(); }
    private getFluidContainer() { return this.reactor.getFluidContainer(); }
    private getFuelContainer() { return this.reactor.getFuelContainer(); }
    private getReactorVolume() { return this.reactor.getEnvironment().getReactorVolume(); }
    private getFuelRodsCount() { return this.reactor.getEnvironment().getPartsCount(ReactorPartType.FuelRod); }
    private getControlRodsCount() { return this.reactor.getEnvironment().getPartsCount(ReactorPartType.ControlRod); }

    private performIrradiation(){
        if(!this.reactor.isMachineActive()){
            return;
        }

        let source = this.reactor.getEnvironment().getNextIrradiationSource();

        if(source.isLinked()){
            this.performIrradiationFrom(source);
        }
    }

    private performIrradiationFrom(source: IIrradiationSource){
        let res = this.radiate(this.getFuelContainer(), source, this.getFuelHeat().value, this.getControlRodsCount());

        if(res){
            this.getFuelHeat().add(res.getFuelHeatChange(this.getFuelRodsCount()));
            this.getReactorHeat().add(res.getEnvironmentHeatChange(this.getReactorVolume()));
            this.fuelUsage = res.fuelUsage;
        }
    }

    private transferHeatBetweenFuelAndReactor(){
        let temperatureDifferential = this.reactor.getFuelHeat().value - this.getReactorHeat().value;

        if(temperatureDifferential > 0.01){
            let energyTransferred = temperatureDifferential * this.reactor.getEnvironment().getFuelToReactorHeatTransferCoefficient();
            let fuelVolEnergy = EnergyConversion.getEnergyFromVolumeAndTemperature(this.getFuelRodsCount(), this.getFuelHeat().value) - energyTransferred;
            let reactorEnergy = EnergyConversion.getEnergyFromVolumeAndTemperature(this.getReactorVolume(), this.getReactorHeat().value) + energyTransferred;
            this.getFuelHeat().set(EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getFuelRodsCount(), fuelVolEnergy));
            this.getReactorHeat().set(EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getReactorVolume(), reactorEnergy));
        }
    }

    private transferHeatBetweenReactorAndCoolant() {
        let temperatureDifferential = this.getReactorHeat().value - this.getCoolantTemperature();

        if (temperatureDifferential > 0.01) {
            let energyTransferred = temperatureDifferential * this.reactor.getEnvironment().getReactorToCoolantSystemHeatTransferCoefficient();
            let reactorEnergy = EnergyConversion.getEnergyFromVolumeAndTemperature(this.getReactorVolume(), this.getReactorHeat().value);

            if (this.reactor.getOperationalMode().isPassive()) {
                energyTransferred *= ReactorLogic.PASSIVE_COOLING_TRANSFER_EFFICIENCY;
                this.generateEnergy(energyTransferred * ReactorLogic.PASSIVE_COOLING_POWER_EFFICIENCY);
            } else {
                energyTransferred -= this.getFluidContainer().onAbsorbHeat(energyTransferred, this.reactor.getVariant());
                this.fluidGeneratedLastTick = this.getFluidContainer().getLiquidVaporizedLastTick();
            }

            reactorEnergy -= energyTransferred;
            this.getReactorHeat().set(EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getReactorVolume(), reactorEnergy));
        }
    }

    private performPassiveHeatLoss() {
        let temperatureDifferential = this.getReactorHeat().value - this.getPassiveCoolantTemperature();

        if (temperatureDifferential > 0.000001) {
            // Lose at least 1FE/t
            let energyLost = Math.max(1, temperatureDifferential * this.reactor.getEnvironment().getReactorHeatLossCoefficient());
            let reactorNewEnergy = Math.max(0, EnergyConversion.getEnergyFromVolumeAndTemperature(this.getReactorVolume(), this.getReactorHeat().value) - energyLost);
            this.getReactorHeat().set(EnergyConversion.getTemperatureFromVolumeAndEnergy(this.getReactorVolume(), reactorNewEnergy));
        }
    }

    private generateEnergy(rawEnergy: number) {
        rawEnergy = rawEnergy * Config.COMMON.general.powerProductionMultiplier * Config.COMMON.reactor.reactorPowerProductionMultiplier * this.reactor.getVariant().getEnergyGenerationEfficiency();
        this.energyBuffer.grow(rawEnergy);
        this.energyGeneratedLastTick = rawEnergy;
    }

    private radiate(fuelContainer: IFuelContainer, source: IIrradiationSource, fuelHeat: number, numControlRods: number): IrradiationData|null {
        if (fuelContainer.getFuelAmount() <= 0) {
            return null;
        }

        let fuelProperties = fuelContainer.getFuelProperties();
        let radiationPenaltyBase = Math.exp(-15 * Math.exp(-0.0025 * fuelHeat));

        let baseFuelAmount = fuelContainer.getFuelAmount() + (fuelContainer.getWasteAmount() / 100);
        let fuelReactivity = fuelContainer.getFuelReactivity();

        let rawRadIntensity = baseFuelAmount * fuelProperties.getFissionEventsPerFuelUnit();
        let scaledRadIntensity = Math.pow(rawRadIntensity, fuelReactivity);
        scaledRadIntensity = Math.pow(scaledRadIntensity / numControlRods, fuelReactivity) * numControlRods;

        let controlRodModifier = (100 - source.getControlRodInsertionRatio()) / 100;
        scaledRadIntensity = scaledRadIntensity * controlRodModifier;
        rawRadIntensity = rawRadIntensity * controlRodModifier;

        let effectiveRadIntensity = scaledRadIntensity * (1 + (-0.95 * Math.exp(-10 * Math.exp(-0.0012 * fuelHeat))));
        let radHardness = 0.2 + (0.8 * radiationPenaltyBase);

        let rawFuelUsage = (fuelProperties.getFuelUnitsPerFissionEvent() * rawRadIntensity / this.getFertilityModifier()) * Config.COMMON.general.fuelUsageMultiplier;
        let data = new IrradiationData();

        data.environmentEnergyAbsorption = 0;
        data.fuelAbsorbedRadiation = 0;
        data.fuelEnergyAbsorption = EnergyConversion.ENERGY_PER_RADIATION_UNIT * effectiveRadIntensity;

        let originCoord = source.getWorldPosition();
        let currentCoord = new Vector3(0, 0, 0);
        let radPacket = new RadiationPacket();

        effectiveRadIntensity *= 0.25;

        for (let dir of source.getIrradiationDirections()) {
            radPacket.hardness = radHardness;
            radPacket.intensity = effectiveRadIntensity;

            let ttl = 4;
            currentCoord.x = originCoord.x;
            currentCoord.y = originCoord.y;
            currentCoord.z = originCoord.z;

            while (ttl > 0 && radPacket.intensity > 0.0001) {
                ttl--;
                currentCoord.add(dir.x, dir.y, dir.z);
                this.reactor.getEnvironment().getModerator(currentCoord).moderateRadiation(data, radPacket);
            }
        }

        this.fertility += data.fuelAbsorbedRadiation;
        data.fuelAbsorbedRadiation = 0;
        fuelContainer.onIrradiation(rawFuelUsage);
        data.fuelUsage = rawFuelUsage;
        return data;
    }

    private performRadiationDecay(isReactorActive: boolean) {
        let denominator = 20;

        if (!isReactorActive) {
            denominator *= 200;
        }

        this.fertility = Math.max(0, this.fertility - Math.max(0.1, this.fertility / denominator));
    }

    private getFertilityModifier() {
        if (this.fertility <= 1) {
            return 1;
        } else {
            return Math.log10(this.fertility) + 1;
        }
    }

    private getPassiveCoolantTemperature() {
        return 20;
    }

    private getCoolantTemperature() {
        if (this.reactor.getOperationalMode().isPassive()) {
            return this.getPassiveCoolantTemperature();
        } else {
            return this.getFluidContainer().getLiquidTemperature(this.getReactorHeat().value);
        }
    }

    // Interface
    tick(active: boolean): void {
        this.reactor.setMachineActive(active);
        this.update();
    }
    refuel(): void {
        this.reactor.getEnvironment().refuel();
    }

    get_width(): number {
        return this.reactor.getWidth();
    }
    get_depth(): number {
        return this.reactor.getDepth();
    }
    get_height(): number {
        return this.reactor.getHeight();
    }

    get_generated(): number {
        return this.reactor.getOperationalMode().isPassive() ? this.energyGeneratedLastTick : this.fluidGeneratedLastTick;
    }
    get_energy(): number {
        return this.energyBuffer.getEnergyStored();
    }
    get_energy_capacity(): number {
        return this.energyBuffer.getCapacity();
    }
    
    get_stack_temperature(): number {
        return this.reactor.getEnvironment().getReactorHeat().value;
    }
    get_fuel_temperature(): number {
        return this.getFuelHeat().value;
    }
    get_fuel_burned(): number {
        return this.fuelUsage;
    }
    get_fuel(): number {
        return this.getFuelContainer().getFuelAmount();
    }
    get_fuel_capacity(): number {
        return this.getFuelContainer().getCapacity();
    }
    get_waste(): number {
        return this.getFuelContainer().getWasteAmount();
    }
    get_fertility(): number {
        return this.getFertility();
    }

    set_control_rod(index: number, insertion: number): void {
    }
    get_control_rod(index: number): number {
        return 0;
    }
    get_control_rod_count(): number {
        return this.getControlRodsCount();
    }
};