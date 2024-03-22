import FuelProperties from "./FuelProperties";

export default class Reactant {
    public IsFuel: boolean = false;
    public RgbColour: number = 0;
    public FuelProperties: FuelProperties;

    constructor() {
        this.FuelProperties = new FuelProperties();
    }
}