class Material {
    static EMPTY_MODERATOR = new Material("empty", "empty", 0, 0, 1, 0);

    readonly id: string;
    readonly displayName: string;
    readonly absorption: number;
    readonly efficiency: number;
    readonly moderation: number;
    readonly conductivity: number;

    constructor(id: string, displayName: string, absorption: number, efficiency: number, moderation: number, conductivity: number){
        this.id = id;
        this.displayName = displayName;
        this.absorption = absorption;
        this.efficiency = efficiency;
        this.moderation = moderation;
        this.conductivity = conductivity;
    }
}

const Materials: { [ver: string]: { [id: string] : Material } } = {
    "extremereactors_1.20": {
        "biggerreactors:fuel_rod": new Material("biggerreactors:fuel_rod", "Fuel Rod", 0.0, 0.0, 0.0, 0.0),
        "minecraft:air": new Material("minecraft:air", "Air", 0.1, 0.25, 1.1, 0.05),
        "forge:storage_block/apatite": new Material("forge:storage_block/apatite", "Apatite", 0.48, 0.73, 1.30, 0.15),
        "forge:storage_block/cinnabar": new Material("forge:storage_block/cinnabar", "Cinnabar", 0.48, 0.75, 1.32, 0.15),
        "forge:storage_blocks/iron": new Material("forge:storage_blocks/iron", "Iron", 0.50, 0.75, 1.40, 0.6),
        "forge:storage_blocks/manasteel": new Material("forge:storage_blocks/manasteel", "Manasteel", 0.60, 0.75, 1.50, 0.6),
        "forge:storage_blocks/elementium": new Material("forge:storage_blocks/elementium", "Elementium", 0.61, 0.77, 1.52, 2.5),
        "forge:storage_blocks/nickel": new Material("forge:storage_blocks/nickel", "Nickel", 0.51, 0.77, 1.40, 0.6),
        "forge:storage_blocks/gold": new Material("forge:storage_blocks/gold", "Gold", 0.52, 0.80, 1.45, 2),
        "forge:storage_blocks/diamond": new Material("forge:storage_blocks/diamond", "Diamond", 0.55, 0.85, 1.50, 3),
        "forge:storage_blocks/netherite": new Material("forge:storage_blocks/netherite", "Netherite", 0.55, 0.95, 1.65, 3),
        "forge:storage_blocks/terrasteel": new Material("forge:storage_blocks/terrasteel", "Terrasteel", 0.57, 0.87, 1.52, 3),
        "forge:storage_blocks/emerald": new Material("forge:storage_blocks/emerald", "Emerald", 0.55, 0.85, 1.50, 2.5),
        "forge:glass/colorless": new Material("forge:glass/colorless", "Glass", 0.20, 0.25, 1.10, 0.3),
        "forge:storage_blocks/copper": new Material("forge:storage_blocks/copper", "Copper", 0.50, 0.75, 1.40, 1),
        "forge:storage_blocks/brass": new Material("forge:storage_blocks/brass", "Brass", 0.52, 0.78, 1.42, 1),
        "forge:storage_blocks/osmium": new Material("forge:storage_blocks/osmium", "Osmium", 0.51, 0.77, 1.41, 1),
        "forge:storage_blocks/refined_obsidian": new Material("forge:storage_blocks/refined_obsidian", "Refined Obsidian", 0.53, 0.79, 1.42, 1),
        "forge:storage_blocks/refined_glowstone": new Material("forge:storage_blocks/refined_glowstone", "Refined Glowstone", 0.54, 0.79, 1.44, 2.5),
        "forge:storage_blocks/bronze": new Material("forge:storage_blocks/bronze", "Bronze", 0.51, 0.77, 1.41, 1),
        "forge:storage_blocks/zinc": new Material("forge:storage_blocks/zinc", "Zinc", 0.51, 0.77, 1.41, 1),
        "forge:storage_blocks/aluminum": new Material("forge:storage_blocks/aluminum", "Aluminum", 0.50, 0.78, 1.42, 0.6),
        "forge:storage_blocks/steel": new Material("forge:storage_blocks/steel", "Steel", 0.50, 0.78, 1.42, 0.6),
        "forge:storage_blocks/invar": new Material("forge:storage_blocks/invar", "Invar", 0.50, 0.79, 1.43, 0.6),
        "forge:storage_blocks/tin": new Material("forge:storage_blocks/tin", "Tin", 0.50, 0.73, 1.38, 1.5),
        "forge:storage_blocks/silver": new Material("forge:storage_blocks/silver", "Silver", 0.51, 0.79, 1.43, 1.5),
        "forge:storage_blocks/signalum": new Material("forge:storage_blocks/signalum", "Signalum", 0.51, 0.75, 1.42, 1),
        "forge:storage_blocks/lumium": new Material("forge:storage_blocks/lumium", "Lumium", 0.51, 0.79, 1.45, 1.5),
        "forge:storage_blocks/lead": new Material("forge:storage_blocks/lead", "Lead", 0.75, 0.75, 1.75, 1.5),
        "forge:storage_blocks/electrum": new Material("forge:storage_blocks/electrum", "Electrum", 0.53, 0.82, 1.47, 2.2),
        "forge:storage_blocks/platinum": new Material("forge:storage_blocks/platinum", "Platinum", 0.57, 0.86, 1.58, 2.5),
        "forge:storage_blocks/enderium": new Material("forge:storage_blocks/enderium", "Enderium", 0.60, 0.88, 1.60, 3),
        "forge:storage_blocks/graphite": new Material("forge:storage_blocks/graphite", "Graphite", 0.10, 0.50, 2.00, 2),
        "minecraft:ice": new Material("minecraft:ice", "Ice", 0.33, 0.33, 1.15, 0.1),
        "bigreactors:dry_ice": new Material("bigreactors:dry_ice", "Dry Ice", 0.42, 0.52, 1.32, 0.1),
        "bigreactors:cryomisi": new Material("bigreactors:cryomisi", "Cryomisi", 0.75, 0.55, 1.60, 2.5),
        "bigreactors:cryomisi_flowing": new Material("bigreactors:cryomisi_flowing", "Cryomisi Flowing", 0.68, 0.49, 1.40, 2.5),
        "bigreactors:tangerium": new Material("bigreactors:tangerium", "Tangerium", 0.90, 0.75, 2.00, 2),
        "bigreactors:tangerium_flowing": new Material("bigreactors:tangerium_flowing", "Tangerium Flowing", 0.84, 0.69, 1.70, 2),
        "bigreactors:redfrigium": new Material("bigreactors:redfrigium", "Redfrigium", 0.66, 0.95, 6.00, 3),
        "bigreactors:redfrigium_flowing": new Material("bigreactors:redfrigium_flowing", "Redfrigium Flowing", 0.57, 0.86, 5.00, 3),
        "minecraft:water": new Material("minecraft:water", "Water", 0.33, 0.5, 1.33, 0.1),
        "minecraft:flowing_water": new Material("minecraft:flowing_water", "Flowing Water", 0.33, 0.5, 1.33, 0.1),
        "astralsorcery:liquid_starlight": new Material("astralsorcery:liquid_starlight", "Liquid Starlight", 0.92, 0.80, 2.00, 3),
        "astralsorcery:liquid_starlight_flowing": new Material("astralsorcery:liquid_starlight_flowing", "Liquid Starlight Flowing", 0.80, 0.85, 2.00, 3),
        "bloodmagic:life_essence_fluid": new Material("bloodmagic:life_essence_fluid", "Life Essence Fluid", 0.80, 0.55, 1.75, 2.5),
        "bloodmagic:life_essence_fluid_flowing": new Material("bloodmagic:life_essence_fluid_flowing", "Life Essence Fluid Flowing", 0.70, 0.55, 1.75, 2.5),
        "mekanism:hydrofluoric_acid": new Material("mekanism:hydrofluoric_acid", "Hydrofluoric Acid", 0.68, 0.45, 1.40, 2.5),
        "mekanism:flowing_hydrofluoric_acid": new Material("mekanism:flowing_hydrofluoric_acid", "Flowing Hydrofluoric Acid", 0.60, 0.45, 1.40, 2.5),
        "mekanism:sodium": new Material("mekanism:sodium", "Sodium", 0.28, 0.60, 1.70, 1),
        "mekanism:flowing_sodium": new Material("mekanism:flowing_sodium", "Flowing Sodium", 0.23, 0.60, 1.70, 1),
        "mekanism:hydrogen_chloride": new Material("mekanism:hydrogen_chloride", "Hydrogen Chloride", 0.38, 0.65, 1.70, 1),
        "mekanism:flowing_hydrogen_chloride": new Material("mekanism:flowing_hydrogen_chloride", "Flowing Hydrogen Chloride", 0.31, 0.65, 1.70, 1),
        "mekanism:ethene": new Material("mekanism:ethene", "Ethene", 0.45, 0.65, 1.90, 1.5),
        "mekanism:flowing_ethene": new Material("mekanism:flowing_ethene", "Flowing Ethene", 0.37, 0.65, 1.90, 1.5),
        "thermal:ender": new Material("thermal:ender", "Ender", 0.92, 0.76, 2.02, 2),
        "thermal:ender_flowing": new Material("thermal:ender_flowing", "Ender Flowing", 0.90, 0.75, 2.00, 2),
        "thermal:redstone": new Material("thermal:redstone", "Redstone", 0.77, 0.56, 1.61, 2.5),
        "thermal:redstone_flowing": new Material("thermal:redstone_flowing", "Redstone Flowing", 0.75, 0.55, 1.60, 2.5)
    },
    "biggerreactors_1.20": {
        "biggerreactors:fuel_rod": new Material("biggerreactors:fuel_rod", "Fuel Rod", 0.0, 0.0, 0.0, 0.0),
        "biggerreactors:ludicrite_block": new Material("biggerreactors:ludicrite_block", "Ludicrite Block", 0.6, 0.87, 3, 3),
        "bloodmagic:life_essence_block": new Material("bloodmagic:life_essence_block", "Life Essence Block", 0.7, 0.55, 1.75, 2.5),
        "mekanism:ethene": new Material("mekanism:ethene", "Ethene", 0.37, 0.65, 1.9, 1.5),
        "mekanism:hydrofluoric_acid": new Material("mekanism:hydrofluoric_acid", "Hydrofluoric Acid", 0.6, 0.45, 1.4, 2.5),
        "mekanism:hydrogen": new Material("mekanism:hydrogen", "Hydrogen", 0.2, 0.3, 1.2, 0.1),
        "mekanism:hydrogen_chloride": new Material("mekanism:hydrogen_chloride", "Hydrogen Chloride", 0.31, 0.65, 1.7, 1),
        "mekanism:lithium": new Material("mekanism:lithium", "Lithium", 0.7, 0.6, 1.04, 0.7),
        "mekanism:oxygen": new Material("mekanism:oxygen", "Oxygen", 0.01, 0.35, 1.04, 0.1),
        "mekanism:sodium": new Material("mekanism:sodium", "Sodium", 0.23, 0.6, 1.7, 1),
        "mekanism:steam": new Material("mekanism:steam", "Steam", 0.33, 0.5, 1.33, 0.5),
        "mekanismgenerators:deuterium": new Material("mekanismgenerators:deuterium", "Deuterium", 0.03, 0.3, 1.07, 0.1),
        "minecraft:air": new Material("minecraft:air", "Air", 0.1, 0.25, 1.1, 0.05),
        "minecraft:glass": new Material("minecraft:glass", "Glass", 0.2, 0.25, 1.1, 0.3),
        "minecraft:ice": new Material("minecraft:ice", "Ice", 0.33, 0.33, 1.15, 0.1),
        "minecraft:snow_block": new Material("minecraft:snow_block", "Snow Block", 0.15, 0.33, 1.05, 0.05),
        "minecraft:water": new Material("minecraft:water", "Water", 0.33, 0.5, 1.33, 0.1),
        "minecraft:lava": new Material("minecraft:lava", "Lava", 0.33, 0.33, 1.15, 0.7),
        "forge:storage_blocks/allthemodium": new Material("forge:storage_blocks/allthemodium", "Allthemodium", 0.66, 0.9, 3.5, 3.5),
        "forge:storage_blocks/aluminum": new Material("forge:storage_blocks/aluminum", "Aluminum", 0.5, 0.78, 1.42, 0.6),
        "forge:storage_blocks/bronze": new Material("forge:storage_blocks/bronze", "Bronze", 0.51, 0.77, 1.41, 1),
        "forge:storage_blocks/copper": new Material("forge:storage_blocks/copper", "Copper", 0.5, 0.75, 1.4, 1),
        "forge:storage_blocks/diamond": new Material("forge:storage_blocks/diamond", "Diamond", 0.55, 0.85, 1.5, 3),
        "forge:storage_blocks/electrum": new Material("forge:storage_blocks/electrum", "Electrum", 0.53, 0.82, 1.47, 2.2),
        "forge:storage_blocks/emerald": new Material("forge:storage_blocks/emerald", "Emerald", 0.55, 0.85, 1.5, 2.5),
        "forge:storage_blocks/enderium": new Material("forge:storage_blocks/enderium", "Enderium", 0.53, 0.88, 1.6, 3),
        "forge:storage_blocks/gold": new Material("forge:storage_blocks/gold", "Gold", 0.52, 0.8, 1.45, 2),
        "forge:storage_blocks/graphite": new Material("forge:storage_blocks/graphite", "Graphite", 0.1, 0.5, 2, 2),
        "forge:storage_blocks/invar": new Material("forge:storage_blocks/invar", "Invar", 0.5, 0.79, 1.43, 0.6),
        "forge:storage_blocks/iron": new Material("forge:storage_blocks/iron", "Iron", 0.5, 0.75, 1.4, 0.6),
        "forge:storage_blocks/lead": new Material("forge:storage_blocks/lead", "Lead", 0.75, 0.75, 1.75, 1.5),
        "forge:storage_blocks/lumium": new Material("forge:storage_blocks/lumium", "Lumium", 0.75, 0.55, 1.5, 1.8),
        "forge:storage_blocks/nickel": new Material("forge:storage_blocks/nickel", "Nickel", 0.5, 0.82, 1.46, 0.6),
        "forge:storage_blocks/osmium": new Material("forge:storage_blocks/osmium", "Osmium", 0.51, 0.77, 1.41, 1),
        "forge:storage_blocks/platinum": new Material("forge:storage_blocks/platinum", "Platinum", 0.53, 0.86, 1.58, 2.5),
        "forge:storage_blocks/signalum": new Material("forge:storage_blocks/signalum", "Signalum", 0.63, 0.66, 1.5, 1.8),
        "forge:storage_blocks/silver": new Material("forge:storage_blocks/silver", "Silver", 0.51, 0.79, 1.43, 1.5),
        "forge:storage_blocks/steel": new Material("forge:storage_blocks/steel", "Steel", 0.5, 0.78, 1.42, 0.6),
        "forge:storage_blocks/tin": new Material("forge:storage_blocks/tin", "Tin", 0.3, 0.7, 1.35, 0.75),
        "forge:storage_blocks/unobtainium": new Material("forge:storage_blocks/unobtainium", "Unobtainium", 0.95, 0.82, 2, 5),
        "forge:storage_blocks/vibranium": new Material("forge:storage_blocks/vibranium", "Vibranium", 0.15, 0.75, 8, 4),
        "forge:storage_blocks/zinc": new Material("forge:storage_blocks/zinc", "Zinc", 0.51, 0.77, 1.41, 1),
        "biggerreactors:liquid_obsidian": new Material("biggerreactors:liquid_obsidian", "Liquid Obsidian", 0.3, 0.7, 1.35, 0.75),
        "allthemodium:molten_allthemodium": new Material("allthemodium:molten_allthemodium", "Molten Allthemodium", 0.66, 0.9, 3.5, 3.5),
        "allthemodium:molten_vibranium": new Material("allthemodium:molten_vibranium", "Molten Vibranium", 0.15, 0.75, 8, 4),
        "allthemodium:molten_unobtainium": new Material("allthemodium:molten_unobtainium", "Molten Unobtainium", 0.95, 0.82, 2, 5),
        "allthemodium:vapor_allthemodium": new Material("allthemodium:vapor_allthemodium", "Allthemodium Vapor", 0.66, 0.9, 3.5, 3.5),
        "allthemodium:vapor_vibranium": new Material("allthemodium:vapor_vibranium", "Vibranium Vapor", 0.15, 0.75, 8, 4),
        "allthemodium:vapor_unobtainium": new Material("allthemodium:vapor_unobtainium", "Unobtainium Vapor", 0.95, 0.82, 2, 5),
        "forge:superheated_sodium": new Material("forge:superheated_sodium", "Superheated Sodium", 0.23, 0.6, 1.7, 1)
    }
};

export { Materials, Material };