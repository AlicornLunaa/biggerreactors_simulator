import IrradiationData from "./IrradiationData";
import RadiationPacket from "./RadiationPacket";

export default interface IRadiationModerator {
    moderateRadiation(irradiationData: IrradiationData, radiation: RadiationPacket): void;
}