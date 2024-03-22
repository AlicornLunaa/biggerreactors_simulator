import IFluidContainer from "./IFluidContainer";
import IFuelContainer from "./IFuelContainer";
import IHeat from "./IHeat";
import IMultiblockReactorVariant from "./IMultiblockReactorVariant";
import IReactorEnvironment from "./IReactorEnvironment";
import OperationalMode from "./OperationalMode";

export default interface IReactorMachine {
    isMachineActive(): boolean;
    setMachineActive(val: boolean): void;
    getVariant(): IMultiblockReactorVariant;
    getOperationalMode(): OperationalMode;
    getEnvironment(): IReactorEnvironment;
    getFuelHeat(): IHeat;
    getFuelContainer(): IFuelContainer;
    getFluidContainer(): IFluidContainer;
    getUiStats(): any; // TODO: Return Stats
    performRefuelingCycle(): boolean;
    performOutputCycle(): void;
    performInputCycle(): boolean;
    getWidth(): number;
    getHeight(): number;
    getDepth(): number;
};