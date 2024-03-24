// https://github.com/BiggerSeries/BiggerReactors/blob/master/src/main/java/net/roguelogix/biggerreactors/multiblocks/reactor/simulation/base/CoolantTank.java
import Config from "./Config";
import HeatBody from "./HeatBody";
import { Material } from "../../Materials";
import { TransitionFluid } from "./TransitionFluid";

class CoolantTank extends HeatBody {

    perSideCapacity: number;
    liquidAmount = 0;
    vaporAmount = 0;

    defaultModerator: Material;
    moderator: Material | null = null;
    transitionProperties: TransitionFluid | null = null;
    
    maxTransitionedLastTick: number = 0;
    transitionedLastTick: number = 0;
    rfTransferredLastTick: number = 0;
    
    constructor(perSideCapacity: number, moderator: Material) {
        super();
        this.perSideCapacity = perSideCapacity;
        this.defaultModerator = moderator;
        this.isInfinite = true;
    }
    
    public transferWith(body: HeatBody, rfkt: number) {
        if (this.transitionProperties == null) {
            this.maxTransitionedLastTick = 0;
            this.transitionedLastTick = 0;
            this.rfTransferredLastTick = 0;
            return 0;
        }
        
        rfkt *= this.transitionProperties.liquidRFMKT;
        
        let multiplier = this.liquidAmount / this.perSideCapacity;
        rfkt *= Math.max(multiplier, 0.01);
        
        let newTemp = body.temperature - this.transitionProperties.boilingPoint;
        newTemp *= Math.exp(-rfkt / body.rfPerKelvin);
        newTemp += this.transitionProperties.boilingPoint;
        
        let toTransfer = newTemp - body.temperature;
        toTransfer *= body.rfPerKelvin;
        
        toTransfer = this.absorbRF(toTransfer);
        
        body.absorbRF(toTransfer);
        return -toTransfer;
    }
    
    public absorbRF(rf: number) {
        if (rf > 0 || this.transitionProperties == null) {
            this.maxTransitionedLastTick = 0;
            this.transitionedLastTick = 0;
            this.rfTransferredLastTick = 0;
            return 0;
        }
        
        rf = Math.abs(rf);
        
        let toTransition = (rf / this.transitionProperties.latentHeat);
        let maxTransitionable = Math.min(this.liquidAmount, this.perSideCapacity - this.vaporAmount);
    
        let transitionMultiplier = Config.Reactor.OutputMultiplier * Config.Reactor.ActiveOutputMultiplier;
        
        this.maxTransitionedLastTick = (toTransition * transitionMultiplier);
        toTransition = Math.min(maxTransitionable, toTransition);
        this.transitionedLastTick = (toTransition * transitionMultiplier);
        
        this.liquidAmount -= this.transitionedLastTick;
        this.vaporAmount += this.transitionedLastTick;
        
        rf = toTransition * this.transitionProperties.latentHeat;
        this.rfTransferredLastTick = rf;
        rf *= -1;
        
        return rf;
    }
    
    public dumpLiquid() {
        this.liquidAmount = 0;
    }
    
    public dumpVapor() {
        this.vaporAmount = 0;
    }
    
    public insertLiquid(amount: number) {
        this.liquidAmount += amount;
        return amount;
    }
    
    public extractLiquid(amount: number) {
        this.liquidAmount -= amount;
        return amount;
    }
    
    public insertVapor(amount: number) {
        this.vaporAmount += amount;
        return amount;
    }
    
    public extractVapor(amount: number) {
        this.vaporAmount -= amount;
        return amount;
    }
    
    public setModeratorProperties(moderator: Material) {
        this.moderator = moderator;
    }
    
    public setTransitionProperties(transitionProperties: TransitionFluid) {
        this.transitionProperties = transitionProperties;
    }
    
    public absorption() {
        if (this.perSideCapacity == 0 || this.moderator == null) {
            return this.defaultModerator.absorption;
        }

        let absorption = 0;
        absorption += this.moderator.absorption * ((this.perSideCapacity) - (this.liquidAmount));
        absorption += this.moderator.absorption * this.liquidAmount;
        absorption /= this.perSideCapacity;
        return absorption;
    }
    
    public heatEfficiency() {
        if (this.perSideCapacity == 0 || this.moderator == null) {
            return this.defaultModerator.efficiency;
        }
        let heatEfficiency = 0;
        heatEfficiency += this.moderator.efficiency * ((this.perSideCapacity) - (this.liquidAmount));
        heatEfficiency += this.moderator.efficiency * this.liquidAmount;
        heatEfficiency /= this.perSideCapacity;
        return heatEfficiency;
    }
    
    public moderation() {
        if (this.perSideCapacity == 0 || this.moderator == null) {
            return this.defaultModerator.moderation;
        }
        let moderation = 0;
        moderation += this.moderator.moderation * ((this.perSideCapacity) - (this.liquidAmount));
        moderation += this.moderator.moderation * this.liquidAmount;
        moderation /= this.perSideCapacity;
        return moderation;
    }
    
    public heatConductivity() {
        if (this.perSideCapacity == 0 || this.moderator == null) {
            return this.defaultModerator.conductivity;
        }
        let heatConductivity = 0;
        heatConductivity += this.moderator.conductivity * ((this.perSideCapacity) - (this.liquidAmount));
        heatConductivity += this.moderator.conductivity * this.liquidAmount;
        heatConductivity /= this.perSideCapacity;
        return heatConductivity;
    }

}

export default CoolantTank;