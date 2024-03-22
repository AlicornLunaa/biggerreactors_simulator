import IMultiblockGeneratorVariant from "./IMultiblockGeneratorVariant";

export default abstract class IFluidContainer {
    // abstract getGas(): Fluid|null;
    // abstract getLiquid(): Fluid|null;
    abstract getGasAmount(): number;
    abstract getLiquidAmount(): number;

    getGasStoredPercentage() {
        return this.getGasAmount() / this.getCapacity();
    }

    getLiquidStoredPercentage() {
        return this.getLiquidAmount() / this.getCapacity();
    }

    abstract getCapacity(): number;
    abstract setCapacity(capacity: number): void;
    // abstract extract(index: FluidType, amount: number, mode: OperationMode): FluidStack;
    abstract getLiquidTemperature(reactorTemperature: number): number;
    abstract onAbsorbHeat(energyAbsorbed: number, variant: IMultiblockGeneratorVariant): number;
    abstract onCondensation(vaporUsed: number, ventAllCoolant: boolean, variant: IMultiblockGeneratorVariant): number;
    abstract getLiquidVaporizedLastTick(): number;
    // abstract getWrapper(portDirection: IoDirection): IFluidHandler;
    // abstract getCoolant(): Coolant|null;
    // abstract getVapor(): Vapor|null;
}