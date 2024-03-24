export class FuelProperties {
    static readonly DEFAULT: FuelProperties = { moderationFactor: 1.5, absorptionCoefficient: 0.5, hardnessDivisor: 1, fissionEventsPerFuelUnit: 0.01, fuelUnitsPerFissionEvent: 0.0007 };
    static readonly INVALID: FuelProperties = { moderationFactor: 1, absorptionCoefficient: 0, hardnessDivisor: 1, fissionEventsPerFuelUnit: 0, fuelUnitsPerFissionEvent: 0 };

    moderationFactor: number;
    absorptionCoefficient: number;
    hardnessDivisor: number;
    fissionEventsPerFuelUnit: number;
    fuelUnitsPerFissionEvent: number;

    constructor(modFac: number, absCoeff: number, hard: number, fissionEvents: number, fuelUnits: number) {
        this.moderationFactor = modFac;
        this.absorptionCoefficient = absCoeff;
        this.hardnessDivisor = hard;
        this.fissionEventsPerFuelUnit = fissionEvents;
        this.fuelUnitsPerFissionEvent = fuelUnits;
    }
}
;
