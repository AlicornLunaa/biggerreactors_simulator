class EnergySystem {
    public static readonly ForgeEnergy = new EnergySystem("Forge Energy", "FE", 1);
    public static readonly RedstoneFlux = new EnergySystem("Forge Energy", "FE", 1);
    public static readonly Tesla = new EnergySystem("Forge Energy", "FE", 1);
    public static readonly EnergyUnit = new EnergySystem("Forge Energy", "FE", 1);
    public static readonly MinecraftJoules = new EnergySystem("Forge Energy", "FE", 1);
    public static readonly Joules = new EnergySystem("Forge Energy", "FE", 1);
    public static readonly GalacticraftJoules = new EnergySystem("Forge Energy", "FE", 1);

    public static readonly REFERENCE = this.ForgeEnergy;

    private readonly _name: string;
    private readonly _unit: string;
    private readonly _conversionRatio: number;

    constructor(name: string, unit: string, conversionRatio: number) {
        this._name = name;
        this._unit = unit;
        this._conversionRatio = conversionRatio;
    }

    public convertTo(target: EnergySystem, amount: number) {
        // convert the amount to the REFERENCE system and then to the requested one
        return amount / this.getConversionRatio() * target.getConversionRatio();
    }

    public getFullName() {
        return this._name;
    }

    public getUnit() {
        return this._unit;
    }

    public getConversionRatio() {
        return this._conversionRatio;
    }
}

export default class WideEnergyBuffer {
    private readonly _system: EnergySystem;
    private _energy: number;
    private _capacity: number;
    private _maxInsert: number;
    private _maxExtract: number;
    private _modified: boolean;

    constructor(system: EnergySystem, capacity: number, maxInsert: number, maxExtract: number) {
        this._system = system;
        this._energy = 0;
        this._capacity = capacity;
        this._maxInsert = maxInsert;
        this._maxExtract = maxExtract;
        this._modified = false;
    }

    public isEmpty() {
        return this._energy == 0;
    }

    public modified() {
        let m = this._modified;
        this._modified = false;
        return m;
    }

    public setCapacity(capacity: number) {
        this._capacity = capacity;

        if (this._energy > capacity) {
            this._energy = capacity;
            this._modified = true;
        }

        return this;
    }

    public getCapacity(){
        return this._capacity;
    }

    public setMaxTransfer(maxTransfer: number) {
        this.setMaxInsert(maxTransfer);
        this.setMaxExtract(maxTransfer);
        return this;
    }

    public setMaxInsert(maxInsert: number) {
        this._maxInsert = Math.min(Math.max(maxInsert, 0), Number.MAX_SAFE_INTEGER);
        return this;
    }

    public setMaxExtract(maxExtract: number) {
        this._maxExtract = Math.min(Math.max(maxExtract, 0), Number.MAX_SAFE_INTEGER);
        return this;
    }

    public getMaxInsert() {
        return this._maxInsert;
    }

    public getMaxExtract() {
        return this._maxExtract;
    }

    public getEnergyStored() {
        return this._energy;
    }

    public grow(amount: number) {
        return this.setEnergyStoredInternal(this._energy + amount);
    }

    public shrink(amount: number) {
        return this.setEnergyStoredInternal(this._energy - amount);
    }

    public merge(other: WideEnergyBuffer) {
        if (!other.isEmpty()) {
            this._energy += other._system.convertTo(this._system, other._energy);
            this._modified = true;
        }
    }

    public empty() {
        this.setEnergyStoredInternal(0);
    }

    public canExtract() {
        return this._maxExtract > 0;
    }

    public canInsert() {
        return this._maxInsert > 0;
    }

    public getEnergySystem() {
        return this._system;
    }

    public setEnergyStored(energy: number, system: EnergySystem) {
        let localSystem = this.getEnergySystem();
        let newAmount = localSystem == system ? energy : system.convertTo(localSystem, energy);
        this._energy = Math.min(Math.max(newAmount, 0), this._capacity);
        this._modified = true;
    }

    private setEnergyStoredInternal(amount: number) {
        this.setEnergyStored(amount, this.getEnergySystem());
        return this;
    }
};