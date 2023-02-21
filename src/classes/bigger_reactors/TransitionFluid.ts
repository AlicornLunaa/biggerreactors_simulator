class TransitionFluid {
    id: string;
    displayName: string;
    latentHeat: number;
    boilingPoint: number;
    liquidThermalConductivity: number;
    gasThermalConductivity: number;
    turbineMultiplier: number;
        
    liquidRFMKT: number = 0;
    gasRFMKT: number = 0;


    constructor(id: string, displayName: string, latentHeat: number, boilingPoint: number, liquidThermalConductivity: number, gasThermalConductivity: number, turbineMultiplier: number){
        this.id = id;
        this.displayName = displayName;
        this.latentHeat = latentHeat;
        this.boilingPoint = boilingPoint;
        this.liquidThermalConductivity = liquidThermalConductivity;
        this.gasThermalConductivity = gasThermalConductivity;
        this.turbineMultiplier = turbineMultiplier;
    }
}

export { TransitionFluid };