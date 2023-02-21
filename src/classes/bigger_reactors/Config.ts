const Config = {

    "Reactor": {
        "FuelUsageMultiplier": 1,
        "OutputMultiplier": 1.0,
        "PassiveOutputMultiplier": 0.5,
        "ActiveOutputMultiplier": 1.0,
        "FuelMBPerIngot": 1000,
        
        "PerFuelRodCapacity": 4000,
        "FuelFertilityMinimumDecay": 0.1,
        "FuelFertilityDecayDenominator": 20,
        "FuelFertilityDecayDenominatorInactiveMultiplier": 200,
        "CasingHeatTransferRFMKT": 0.6,
        "FuelToStackRFKTMultiplier": 1.0,
        "StackToCoolantRFMKT": 0.6,
        "StackToAmbientRFMKT": 0.001,
        "PassiveBatteryPerExternalBlock": 100_000,
        "PassiveCoolingTransferEfficiency": 0.2,
        "CoolantTankAmountPerFuelRod": 10_000,
        "CaseFEPerUnitVolumeKelvin": 10,
        "RodFEPerUnitVolumeKelvin": 10,
        "FuelReactivity": 1.05,
        "FissionEventsPerFuelUnit": 0.1,
        "FEPerRadiationUnit": 10,
        "FuelPerRadiationUnit": 0.0007,
        "IrradiationDistance": 4,
        "FuelHardnessDivisor": 1,
        "FuelAbsorptionCoefficient": 0.5,
        "FuelModerationFactor": 1.5,
        "RadIntensityScalingMultiplier": 0.95,
        "RadIntensityScalingRateExponentMultiplier": 1.2,
        "RadIntensityScalingShiftMultiplier": 1,
        "RadPenaltyShiftMultiplier": 15,
        "RadPenaltyRateMultiplier": 2.5,
        "FuelAbsorptionScalingMultiplier": 0.95,
        "FuelAbsorptionScalingShiftMultiplier": 1,
        "FuelAbsorptionScalingRateExponentMultiplier": 2.2,
        "fuelRadScalingMultiplier": 1.0,
    },
    
    "Turbine": {
        "FlowRatePerBlock": 5000,
        "TankVolumePerBlock": 10000,
        "FluidPerBladeLinerKilometre": 20,
        "RotorAxialMassPerShaft": 100,
        "RotorAxialMassPerBlade": 100,
        "FrictionDragMultiplier": 0.0005,
        "AerodynamicDragMultiplier": 0.0005,
        "CoilDragMultiplier": 10,
        "BatterySizePerCoilBlock": 300_000
    },
    
    "SimulationRays": 64,
    "HeatDisplayMax": 2000,
    "ControlRodBatchSize": 32

}

export default Config;