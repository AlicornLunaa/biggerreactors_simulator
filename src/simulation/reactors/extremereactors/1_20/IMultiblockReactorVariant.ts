import IMultiblockGeneratorVariant from "./IMultiblockGeneratorVariant";

export default abstract class IMultiblockReactorVariant extends IMultiblockGeneratorVariant {
    abstract getRadiationAttenuation(): number;
    abstract getResidualRadiationAttenuation(): number;
    abstract getSolidFuelConversionEfficiency(): number;
    abstract getFluidFuelConversionEfficiency(): number;

    solidSourceAmountToReactantAmount(originalAmount: number): number {
        return Math.floor(originalAmount * this.getSolidFuelConversionEfficiency());
    }

    reactantAmountToSolidSourceAmount(originalAmount: number): number {
        return Math.floor(originalAmount / this.getSolidFuelConversionEfficiency());
    }

    fluidSourceAmountToReactantAmount(originalAmount: number): number {
        return Math.floor(originalAmount * this.getFluidFuelConversionEfficiency());
    }

    reactantAmountToFluidSourceAmount(originalAmount: number): number {
        return Math.floor(originalAmount / this.getFluidFuelConversionEfficiency());
    }
}