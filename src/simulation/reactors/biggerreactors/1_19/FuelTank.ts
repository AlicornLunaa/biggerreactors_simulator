// https://github.com/BiggerSeries/BiggerReactors/blob/master/src/main/java/net/roguelogix/biggerreactors/multiblocks/reactor/simulation/base/FuelTank.java
class FuelTank {

    capacity: number;
    fuel: number = 0;
    waste: number = 0;
    partialUsed: number = 0;
    burnedLastTick: number = 0;
    
    constructor(capacity: number) {
        this.capacity = capacity;
    }
    
    public burn(amount: number) {
        if(amount == Infinity || amount == 0) {
            this.burnedLastTick = 0;
            return;
        }
        
        let toProcess = this.partialUsed + amount;
        toProcess = Math.min(toProcess, this.fuel);
        
        this.burnedLastTick = toProcess - this.partialUsed;
        
        this.partialUsed = toProcess;
        if (toProcess >= 1) {
            let toBurn = toProcess;
            this.fuel -= toBurn;
            this.waste += toBurn;
            this.partialUsed -= toBurn;
        }
    }
    
    public totalStored() {
        return this.fuel + this.waste;
    }
    
    public insertFuel(amount: number, simulated: number) {
        if (this.totalStored() >= this.capacity) {
            // if we are overfilled, then we need to *not* insert more
            return 0;
        }
        
        amount = Math.min(amount, this.capacity - this.totalStored());
        
        if (!simulated) {
            this.fuel += amount;
        }
        
        return amount;
    }
    
    public insertWaste(amount: number, simulated: boolean) {
        if (this.totalStored() >= this.capacity) {
            return 0;
        }
        
        amount = Math.min(amount, this.capacity - this.totalStored());
        
        if (!simulated) {
            this.waste += amount;
        }
        
        return amount;
    }
    
    public extractFuel(amount: number, simulated: boolean) {
        amount = Math.min(this.fuel, amount);
        if (!simulated) {
            this.fuel -= amount;
        }
        return amount;
    }
    
    public extractWaste(amount: number, simulated: boolean) {
        amount = Math.min(this.waste, amount);
        if (!simulated) {
            this.waste -= amount;
        }
        return amount;
    }
    
}

export default FuelTank;