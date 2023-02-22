import BaseReactorSimulation from "./BaseReactorSimulation";
import Config from "./Config";
import RayStep from "./Ray";
import SimulationDescription from "./SimulationDescription";

export default class TimeSlicedReactorSimulation extends BaseReactorSimulation {
    
    currentRod: number = 0;
    rodOffset: number = 0;

    constructor(desc: SimulationDescription){
        super(desc);
    }

    public radiate(): number {
        if(this.fuelTank.fuel <= 0){
            return 0;
        }

        this.currentRod++;
        if(this.currentRod >= this.controlRods.length){
            this.currentRod = 0;
            this.rodOffset++;
        }

        let yLevel = this.currentRod % this.y;
        let currentRod = this.currentRod + this.rodOffset;
        currentRod %= this.controlRods.length;

        let radiationPenaltyBase = Math.exp(-Config.Reactor.RadPenaltyShiftMultiplier * Math.exp(-0.001 * Config.Reactor.RadPenaltyRateMultiplier * (this.fuelHeat.temperature - 273.15)));
        let baseFuelAmount = this.fuelTank.fuel + (this.fuelTank.waste / 100);
        let rawRadIntensity = baseFuelAmount * Config.Reactor.FissionEventsPerFuelUnit;
        let scaledRadIntensity = Math.pow((Math.pow(rawRadIntensity, Config.Reactor.FuelReactivity) / this.controlRods.length), Config.Reactor.FuelReactivity) * this.controlRods.length;

        let initialHardness = Math.min(1, 0.2 + (0.8 * radiationPenaltyBase));
        let rawIntensity = (1 + (-Config.Reactor.RadIntensityScalingMultiplier * Math.exp(-10 * Config.Reactor.RadIntensityScalingShiftMultiplier * Math.exp(-0.001 * Config.Reactor.RadIntensityScalingRateExponentMultiplier * (this.fuelHeat.temperature - 273.15)))));
        let fuelAbsorptionTemperatureCoefficient = (1 - (Config.Reactor.FuelAbsorptionScalingMultiplier * Math.exp(-10 * Config.Reactor.FuelAbsorptionScalingShiftMultiplier * Math.exp(-0.001 * Config.Reactor.FuelAbsorptionScalingRateExponentMultiplier * (this.fuelHeat.temperature - 273.15)))));
        let fuelHardnessMultiplier = 1 / Config.Reactor.FuelHardnessDivisor;

        let rawFuelUsage = 0;
        let fuelRFAdded = 0;
        let fuelRadAdded = 0;
        let caseRFAdded = 0;

        let rod = this.controlRods[currentRod];
        let controlRodModifier = (100 - rod.insertion) / 100;
        let effectiveRadIntensity = (scaledRadIntensity * controlRodModifier);
        let effectiveRawRadIntensity = (rawRadIntensity * controlRodModifier);
        let iniitalIntensity = effectiveRadIntensity * rawIntensity;

        rawFuelUsage += (Config.Reactor.FuelPerRadiationUnit * effectiveRawRadIntensity / this.fertility()) * Config.Reactor.FuelUsageMultiplier;
        fuelRFAdded += Config.Reactor.FEPerRadiationUnit * iniitalIntensity;

        let rayMultiplier = 1 / RayStep.rays.length;
        for(let j = 0; j < RayStep.rays.length; j++){
            let raySteps = RayStep.rays[j];
            let neutronHardness = initialHardness;
            let neutronIntensity = iniitalIntensity * rayMultiplier;

            for(let k = 0; k < raySteps.length; k++){
                let rayStep = raySteps[k];
                let currentX = rod.x + rayStep.offset.x;
                let currentY = yLevel + rayStep.offset.y;
                let currentZ = rod.y + rayStep.offset.z;

                if (currentX < 0 || currentX >= this.x ||
                    currentY < 0 || currentY >= this.y ||
                    currentZ < 0 || currentZ >= this.z) {
                    break;
                }

                let properties = this.moderatorProperties[currentX][currentY][currentZ];

                if(properties != null){
                    let radiationAbsorbed = neutronIntensity * properties.absorption * (1 - neutronHardness) * rayStep.length;
                    neutronIntensity = Math.max(0, neutronIntensity - radiationAbsorbed);
                    neutronHardness = neutronHardness / (((properties.moderation - 1) * rayStep.length) + 1);
                    caseRFAdded += properties.efficiency * radiationAbsorbed * Config.Reactor.FEPerRadiationUnit;
                } else {
                    // Fuel rod
                    // Scale control rod insertion 0..1
                    let controlRodInsertion = this.controlRodsXZ[currentX][currentZ]!.insertion * .001;
                    
                    // Fuel absorptiveness is determined by control rod + a heat modifier.
                    // Starts at 1 and decays towards 0.05, reaching 0.6 at 1000 and just under 0.2 at 2000. Inflection point at about 500-600.
                    // Harder radiation makes absorption more difficult.
                    let baseAbsorption = fuelAbsorptionTemperatureCoefficient * (1 - (neutronHardness * fuelHardnessMultiplier));
                    
                    // Some fuels are better at absorbing radiation than others
                    let scaledAbsorption = baseAbsorption * Config.Reactor.FuelAbsorptionCoefficient * rayStep.length;
                    
                    // Control rods increase total neutron absorption, but decrease the total neutrons which fertilize the fuel
                    // Absorb up to 50% better with control rods inserted.
                    let controlRodBonus = (1 - scaledAbsorption) * controlRodInsertion * 0.5;
                    let controlRodPenalty = scaledAbsorption * controlRodInsertion * 0.5;
                    
                    let radiationAbsorbed = (scaledAbsorption + controlRodBonus) * neutronIntensity;
                    let fertilityAbsorbed = (scaledAbsorption - controlRodPenalty) * neutronIntensity;
                    
                    // Full insertion doubles the moderation factor of the fuel as well as adding its own level
                    let fuelModerationFactor = Config.Reactor.FuelModerationFactor + (Config.Reactor.FuelModerationFactor * controlRodInsertion + controlRodInsertion);
                    
                    neutronIntensity = Math.max(0, neutronIntensity - (radiationAbsorbed));
                    neutronHardness = neutronHardness / (((fuelModerationFactor - 1.0) * rayStep.length) + 1.0);
                    
                    // Being irradiated both heats up the fuel and also enhances its fertility
                    fuelRFAdded += radiationAbsorbed * Config.Reactor.FEPerRadiationUnit;
                    fuelRadAdded += fertilityAbsorbed;
                }
            }
        }

        if(!Number.isNaN(fuelRadAdded)){
            if (Config.Reactor.fuelRadScalingMultiplier != 0) {
                fuelRadAdded *= Config.Reactor.fuelRadScalingMultiplier * (Config.Reactor.PerFuelRodCapacity / Math.max(1.0, this.fuelTank.totalStored()));
            }
            this.fuelFertility += fuelRadAdded;
        }
        if (!Number.isNaN(fuelRFAdded)) {
            this.fuelHeat.absorbRF(fuelRFAdded);
        }
        if (!Number.isNaN(caseRFAdded)) {
            this.stackHeat.absorbRF(caseRFAdded);
        }

        return rawFuelUsage;
    }

}