export default abstract class IMultiblockGeneratorVariant {
    abstract getPartEnergyCapacity(): number;
    abstract getEnergyGenerationEfficiency(): number;
    abstract getMaxEnergyExtractionRate(): number;
    abstract getChargerMaxRate(): number;
    abstract getPartFluidCapacity(): number;
    abstract getMaxFluidCapacity(): number;
    abstract getVaporGenerationEfficiency(): number;
}