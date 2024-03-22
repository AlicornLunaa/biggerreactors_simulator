import FuelProperties from "./FuelProperties";
import Reactant from "./Reactant";

export default abstract class IFuelContainer {
    abstract getFuel(): Reactant|null;
    abstract getWaste(): Reactant|null;
    abstract getFuelProperties(): FuelProperties;
    abstract getFuelAmount(): number;
    abstract getWasteAmount(): number;
    abstract setCapacity(capacity: number): void;
    abstract getCapacity(): number;
    abstract getFuelReactivity(): number;
    abstract onIrradiation(fuelUsed: number): void;

    public isEmpty(): boolean {
        return 0 == this.getFuelAmount() + this.getWasteAmount();
    }
};