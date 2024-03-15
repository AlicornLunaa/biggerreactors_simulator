class HeatBody {
    isInfinite: boolean = false;
    rfPerKelvin: number = 0;
    temperature: number = 0;

    public transferWith(other: HeatBody, rfkt: number): number {
        if (this.isInfinite && other.isInfinite) {
            return 0;
        }
        if (!this.isInfinite && other.isInfinite) {
            return -other.transferWith(this, rfkt);
        }
        
        let rfTransferred: number;
        
        if (!this.isInfinite) {
            let targetTemperature = ((this.rfPerKelvin * (this.temperature - other.temperature)) / (this.rfPerKelvin + other.rfPerKelvin));
            targetTemperature += other.temperature;
            
            let denominator = rfkt * (this.rfPerKelvin + other.rfPerKelvin);
            denominator /= this.rfPerKelvin * other.rfPerKelvin;
            denominator = Math.exp(-denominator);
            
            let thisNewTemp = this.temperature - targetTemperature;
            thisNewTemp *= denominator; // its flipped in the exp
            thisNewTemp += targetTemperature;
    
            let otherNewTemp = other.temperature - targetTemperature;
            otherNewTemp *= denominator; // its flipped in the exp
            otherNewTemp += targetTemperature;
            
            rfTransferred = (otherNewTemp - other.temperature) * other.rfPerKelvin;
            
            this.temperature = thisNewTemp;
            other.temperature = otherNewTemp;
            
        } else {
            
            let newTemp = other.temperature - this.temperature;
            newTemp *= Math.exp(-rfkt / other.rfPerKelvin);
            newTemp += this.temperature;
    
            rfTransferred = (newTemp - other.temperature) * other.rfPerKelvin;
    
            other.temperature = newTemp;
        }
        
        return rfTransferred;
    }
    
    public additionalRFForTemperature(targetTemperature: number): number {
        let currentRF = this.rfFromTemperature(this.temperature);
        let targetRF = this.rfFromTemperature(targetTemperature);
        return targetRF - currentRF;
    }
    
    public temperatureWithAdditionalRF(rf: number) {
        return this.temperature + (this.isInfinite ? 0 : rf / (this.rfPerKelvin));
    }
    
    public absorbRF(rf: number) {
        this.temperature = this.temperatureWithAdditionalRF(rf);
        return rf;
    }
    
    public rfFromTemperature(temperature: number) {
        return temperature * this.rfPerKelvin;
    }
    
    public rf() {
        return this.rfFromTemperature(this.temperature);
    }
    
    public tempFromRF(rf: number) {
        return rf / (this.rfPerKelvin);
    }
}

export default HeatBody;