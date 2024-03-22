export default class FuelProperties {
    public static readonly DEFAULT = new FuelProperties(1.5, 0.5, 1.0, 0.01, 0.0007);
    public static readonly INVALID = new FuelProperties(1.0, 0.0, 1.0, 0.0, 0.0);

    private _fuelModerationFactor: number = 0;
    private _fuelAbsorptionCoefficient: number = 0;
    private _fuelHardnessDivisor: number = 0;
    private _fissionEventsPerFuelUnit: number = 0;
    private _fuelUnitsPerFissionEvent: number = 0;

    constructor(moderationFactor: number = 1.5, absorptionCoefficient: number = 0.5, hardnessDivisor: number = 1, fissionEventsPerFuelUnit: number = 0.01, fuelUnitsPerFissionEvent: number = 0.0007) {
        this.setModerationFactor(moderationFactor);
        this.setAbsorptionCoefficient(absorptionCoefficient);
        this.setHardnessDivisor(hardnessDivisor);
        this.setFissionEventsPerFuelUnit(fissionEventsPerFuelUnit);
        this.setFuelUnitsPerFissionEvent(fuelUnitsPerFissionEvent);
    }

    public getModerationFactor(): number {
        return this._fuelModerationFactor;
    }

    public setModerationFactor(value: number): void {
        this._fuelModerationFactor = Math.max(1.0, value);
    }

    public getAbsorptionCoefficient(): number {
        return this._fuelAbsorptionCoefficient;
    }

    public setAbsorptionCoefficient(value: number): void {
        this._fuelAbsorptionCoefficient = Math.min(Math.max(value, 0.0), 1.0);
    }

    public getHardnessDivisor(): number {
        return this._fuelHardnessDivisor;
    }

    public setHardnessDivisor(value: number): void {
        this._fuelHardnessDivisor = Math.max(1.0, value);
    }

    public getFissionEventsPerFuelUnit(): number {
        return this._fissionEventsPerFuelUnit;
    }

    public setFissionEventsPerFuelUnit(value: number): void {
        this._fissionEventsPerFuelUnit = Math.max(0.0, value);
    }

    public getFuelUnitsPerFissionEvent(): number {
        return this._fuelUnitsPerFissionEvent;
    }

    public setFuelUnitsPerFissionEvent(value: number): void {
        this._fuelUnitsPerFissionEvent = Math.max(0.0, value);
    }
}