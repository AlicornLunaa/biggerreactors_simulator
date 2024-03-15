// https://github.com/BiggerSeries/BiggerReactors/blob/master/src/main/java/net/roguelogix/biggerreactors/multiblocks/reactor/simulation/base/Battery.java
import Config from "./Config";
import HeatBody from "./HeatBody";

class Battery extends HeatBody {
    capacity: number;
    stored: number = 0;
    generatedLastTick: number = 0;

    constructor(capacity: number){
        super();
        this.capacity = capacity;
    }

    public transferWith(other: HeatBody, rfkt: number) {
        let newTemp = other.temperature - this.temperature;
        newTemp *= Math.exp(-rfkt / other.rfPerKelvin);
        newTemp += this.temperature;
        
        let rfTransferred = (newTemp - other.temperature) * other.rfPerKelvin;
        
        this.generatedLastTick = (-rfTransferred * Config.Reactor.OutputMultiplier * Config.Reactor.PassiveOutputMultiplier);
        this.stored += this.generatedLastTick;
        if (this.stored > this.capacity) {
            this.stored = this.capacity;
        }
        
        other.temperature = newTemp;
        
        return rfTransferred;
    }
    
    public extract(toExtract: number) {
        this.stored -= toExtract;
        return toExtract;
    }
}

export default Battery;