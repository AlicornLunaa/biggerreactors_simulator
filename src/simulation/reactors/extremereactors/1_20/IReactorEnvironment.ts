import { BlockPos } from "./BlockPos";
import IHeat from "./IHeat";
import IIrradiationSource from "./IIrradiationSource";
import IRadiationModerator from "./IRadiationModerator";
import { ReactorPartType } from "./ReactorPartType";

export default interface IReactorEnvironment {
    isSimulator(): boolean;
    getReactorHeat(): IHeat;
    getReactorVolume(): number;
    getFuelToReactorHeatTransferCoefficient(): number;
    getReactorToCoolantSystemHeatTransferCoefficient(): number;
    getReactorHeatLossCoefficient(): number;
    getNextIrradiationSource(): IIrradiationSource;
    getModerator(position: BlockPos): IRadiationModerator;
    getPartsCount(type: ReactorPartType): number;
    refuel(): void;
    ejectWaste(voidLeftover: boolean): void;
}