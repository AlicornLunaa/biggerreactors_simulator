export default class EnergyConversion {
    public static readonly ENERGY_PER_RADIATION_UNIT = 10;
    private static readonly ENERGY_PER_CENTIGRADE_PER_UNIT_VOLUME = 10;

    public static getEnergyFromVolumeAndTemperature(volume: number, temperature: number) {
        return temperature * volume * this.ENERGY_PER_CENTIGRADE_PER_UNIT_VOLUME;
    }

    //TODO was:getTempFromVolumeAndRF
    public static getTemperatureFromVolumeAndEnergy(volume: number, energy: number) {
        return energy / (volume * this.ENERGY_PER_CENTIGRADE_PER_UNIT_VOLUME);
    }
}