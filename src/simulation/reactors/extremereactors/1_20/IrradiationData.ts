import EnergyConversion from "./EnergyConversion";

export default class IrradiationData {
    public fuelUsage = 0;
    public environmentEnergyAbsorption = 0;
    public fuelEnergyAbsorption = 0;
    public fuelAbsorbedRadiation = 0; // in rad-units

    public IrradiationData() {
        this.fuelUsage = 0;
        this.environmentEnergyAbsorption = 0;
        this.fuelEnergyAbsorption = 0;
        this.fuelAbsorbedRadiation = 0;
    }

    public getEnvironmentHeatChange(environmentVolume: number) {
        return EnergyConversion.getTemperatureFromVolumeAndEnergy(environmentVolume, this.environmentEnergyAbsorption);
    }

    public getFuelHeatChange(fuelVolume: number) {
        return EnergyConversion.getTemperatureFromVolumeAndEnergy(fuelVolume, this.fuelEnergyAbsorption);
    }
}