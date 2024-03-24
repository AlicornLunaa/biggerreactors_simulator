export class Variant {
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
    private constructor(name: "basic" | "reinforced", radAttenuation: number, residRadAttenuation: number, solidEfficiency: number, fluidEfficiency: number,
        partEnergyCapacity: number, energyGenEff: number, maxEnergyExtract: number, partFluidCap: number, maxFluidCap: number, vaporGenEff: number) {
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
}
;
