class Material {
    static EMPTY_MODERATOR = new Material("empty", "empty", 0, 0, 0, 0);

    id: string;
    displayName: string;
    absorption: number;
    efficiency: number;
    moderation: number;
    conductivity: number;

    constructor(id: string, displayName: string, absorption: number, efficiency: number, moderation: number, conductivity: number){
        this.id = id;
        this.displayName = displayName;
        this.absorption = absorption;
        this.efficiency = efficiency;
        this.moderation = moderation;
        this.conductivity = conductivity;
    }
}

const Materials = [
    [
        new Material("biggerreactors:fuel_rod", "Fuel Rod", 0.0, 0.0, 0.0, 0.0),
        new Material("biggerreactors:ludicrite_block", "Ludicrite Block", 0.6, 0.87, 3, 3),
        new Material("bloodmagic:life_essence_block", "Life Essence Block", 0.7, 0.55, 1.75, 2.5),
        new Material("mekanism:ethene", "Ethene", 0.37, 0.65, 1.9, 1.5),
        new Material("mekanism:hydrofluoric_acid", "Hydrofluoric Acid", 0.6, 0.45, 1.4, 2.5),
        new Material("mekanism:hydrogen", "Hydrogen", 0.2, 0.3, 1.2, 0.1),
        new Material("mekanism:hydrogen_chloride", "Hydrogen Chloride", 0.31, 0.65, 1.7, 1),
        new Material("mekanism:lithium", "Lithium", 0.7, 0.6, 1.04, 0.7),
        new Material("mekanism:oxygen", "Oxygen", 0.01, 0.35, 1.04, 0.1),
        new Material("mekanism:sodium", "Sodium", 0.23, 0.6, 1.7, 1),
        new Material("mekanism:steam", "Steam", 0.33, 0.5, 1.33, 0.5),
        new Material("mekanismgenerators:deuterium", "Deuterium", 0.03, 0.3, 1.07, 0.1),
        new Material("minecraft:air", "Air", 0.1, 0.25, 1.1, 0.05),
        new Material("minecraft:glass", "Glass", 0.2, 0.25, 1.1, 0.3),
        new Material("minecraft:ice", "Ice", 0.33, 0.33, 1.15, 0.1),
        new Material("minecraft:snow_block", "Snow Block", 0.15, 0.33, 1.05, 0.05),
        new Material("minecraft:water", "Water", 0.33, 0.5, 1.33, 0.1),
        new Material("minecraft:lava", "Lava", 0.33, 0.33, 1.15, 0.7),
        new Material("forge:storage_blocks/allthemodium", "Allthemodium", 0.66, 0.9, 3.5, 3.5),
        new Material("forge:storage_blocks/aluminum", "Aluminum", 0.5, 0.78, 1.42, 0.6),
        new Material("forge:storage_blocks/bronze", "Bronze", 0.51, 0.77, 1.41, 1),
        new Material("forge:storage_blocks/copper", "Copper", 0.5, 0.75, 1.4, 1),
        new Material("forge:storage_blocks/diamond", "Diamond", 0.55, 0.85, 1.5, 3),
        new Material("forge:storage_blocks/electrum", "Electrum", 0.53, 0.82, 1.47, 2.2),
        new Material("forge:storage_blocks/emerald", "Emerald", 0.55, 0.85, 1.5, 2.5),
        new Material("forge:storage_blocks/enderium", "Enderium", 0.53, 0.88, 1.6, 3),
        new Material("forge:storage_blocks/gold", "Gold", 0.52, 0.8, 1.45, 2),
        new Material("forge:storage_blocks/graphite", "Graphite", 0.1, 0.5, 2, 2),
        new Material("forge:storage_blocks/invar", "Invar", 0.5, 0.79, 1.43, 0.6),
        new Material("forge:storage_blocks/iron", "Iron", 0.5, 0.75, 1.4, 0.6),
        new Material("forge:storage_blocks/lead", "Lead", 0.75, 0.75, 1.75, 1.5),
        new Material("forge:storage_blocks/lumium", "Lumium", 0.75, 0.55, 1.5, 1.8),
        new Material("forge:storage_blocks/nickel", "Nickel", 0.5, 0.82, 1.46, 0.6),
        new Material("forge:storage_blocks/osmium", "Osmium", 0.51, 0.77, 1.41, 1),
        new Material("forge:storage_blocks/platinum", "Platinum", 0.53, 0.86, 1.58, 2.5),
        new Material("forge:storage_blocks/signalum", "Signalum", 0.63, 0.66, 1.5, 1.8),
        new Material("forge:storage_blocks/silver", "Silver", 0.51, 0.79, 1.43, 1.5),
        new Material("forge:storage_blocks/steel", "Steel", 0.5, 0.78, 1.42, 0.6),
        new Material("forge:storage_blocks/tin", "Tin", 0.3, 0.7, 1.35, 0.75),
        new Material("forge:storage_blocks/unobtainium", "Unobtainium", 0.95, 0.82, 2, 5),
        new Material("forge:storage_blocks/vibranium", "Vibranium", 0.15, 0.75, 8, 4),
        new Material("forge:storage_blocks/zinc", "Zinc", 0.51, 0.77, 1.41, 1),
        new Material("biggerreactors:liquid_obsidian", "Liquid Obsidian", 0.3, 0.7, 1.35, 0.75),
        new Material("allthemodium:molten_allthemodium", "Molten Allthemodium", 0.66, 0.9, 3.5, 3.5),
        new Material("allthemodium:molten_vibranium", "Molten Vibranium", 0.15, 0.75, 8, 4),
        new Material("allthemodium:molten_unobtainium", "Molten Unobtainium", 0.95, 0.82, 2, 5),
        new Material("allthemodium:vapor_allthemodium", "Allthemodium Vapor", 0.66, 0.9, 3.5, 3.5),
        new Material("allthemodium:vapor_vibranium", "Vibranium Vapor", 0.15, 0.75, 8, 4),
        new Material("allthemodium:vapor_unobtainium", "Unobtainium Vapor", 0.95, 0.82, 2, 5),
        new Material("forge:superheated_sodium", "Superheated Sodium", 0.23, 0.6, 1.7, 1)
    ],
    [
        new Material("biggerreactors:fuel_rod", "Fuel Rod", 0.0, 0.0, 0.0, 0.0),
        new Material("astralsorcery:liquid_starlight", "Liquid Starlight", 0.85, 0.8, 2.0, 3.0),
        new Material("biggerreactors:ludicrite_block", "Ludicrite Block", 0.6, 0.87, 3, 3),
        new Material("bloodmagic:life_essence_block", "Life Essence Block", 0.7, 0.55, 1.75, 2.5),
        new Material("mekanism:ethene", "Ethene", 0.37, 0.65, 1.9, 1.5),
        new Material("mekanism:hydrofluoric_acid", "Hydrofluoric Acid", 0.6, 0.45, 1.4, 2.5),
        new Material("mekanism:hydrogen", "Hydrogen", 0.2, 0.3, 1.2, 0.1),
        new Material("mekanism:hydrogen_chloride", "Hydrogen Chloride", 0.31, 0.65, 1.7, 1),
        new Material("mekanism:lithium", "Lithium", 0.7, 0.6, 1.04, 0.7),
        new Material("mekanism:oxygen", "Oxygen", 0.01, 0.35, 1.04, 0.1),
        new Material("mekanism:sodium", "Sodium", 0.23, 0.6, 1.7, 1),
        new Material("mekanism:steam", "Steam", 0.33, 0.5, 1.33, 0.5),
        new Material("mekanismgenerators:deuterium", "Deuterium", 0.03, 0.3, 1.07, 0.1),
        new Material("minecraft:air", "Air", 0.1, 0.25, 1.1, 0.05),
        new Material("minecraft:glass", "Glass", 0.2, 0.25, 1.1, 0.3),
        new Material("minecraft:ice", "Ice", 0.33, 0.33, 1.15, 0.1),
        new Material("minecraft:snow_block", "Snow Block", 0.15, 0.33, 1.05, 0.05),
        new Material("minecraft:water", "Water", 0.33, 0.5, 1.33, 0.1),
        new Material("forge:storage_blocks/allthemodium", "Allthemodium", 0.66, 0.9, 3.5, 3.5),
        new Material("forge:storage_blocks/aluminum", "Aluminum", 0.5, 0.78, 1.42, 0.6),
        new Material("forge:storage_blocks/bronze", "Bronze", 0.51, 0.77, 1.41, 1),
        new Material("forge:storage_blocks/copper", "Copper", 0.5, 0.75, 1.4, 1),
        new Material("forge:storage_blocks/diamond", "Diamond", 0.55, 0.85, 1.5, 3),
        new Material("forge:storage_blocks/electrum", "Electrum", 0.53, 0.82, 1.47, 2.2),
        new Material("forge:storage_blocks/emerald", "Emerald", 0.55, 0.85, 1.5, 2.5),
        new Material("forge:storage_blocks/enderium", "Enderium", 0.53, 0.88, 1.6, 3),
        new Material("forge:storage_blocks/gold", "Gold", 0.52, 0.8, 1.45, 2),
        new Material("forge:storage_blocks/graphite", "Graphite", 0.1, 0.5, 2, 2),
        new Material("forge:storage_blocks/invar", "Invar", 0.5, 0.79, 1.43, 0.6),
        new Material("forge:storage_blocks/iron", "Iron", 0.5, 0.75, 1.4, 0.6),
        new Material("forge:storage_blocks/lead", "Lead", 0.75, 0.75, 1.75, 1.5),
        new Material("forge:storage_blocks/lumium", "Lumium", 0.75, 0.55, 1.5, 1.8),
        new Material("forge:storage_blocks/nickel", "Nickel", 0.5, 0.82, 1.46, 0.6),
        new Material("forge:storage_blocks/osmium", "Osmium", 0.51, 0.77, 1.41, 1),
        new Material("forge:storage_blocks/platinum", "Platinum", 0.53, 0.86, 1.58, 2.5),
        new Material("forge:storage_blocks/signalum", "Signalum", 0.63, 0.66, 1.5, 1.8),
        new Material("forge:storage_blocks/silver", "Silver", 0.51, 0.79, 1.43, 1.5),
        new Material("forge:storage_blocks/steel", "Steel", 0.5, 0.78, 1.42, 0.6),
        new Material("forge:storage_blocks/tin", "Tin", 0.3, 0.7, 1.35, 0.75),
        new Material("forge:storage_blocks/unobtainium", "Unobtainium", 0.95, 0.82, 2, 5),
        new Material("forge:storage_blocks/vibranium", "Vibranium", 0.15, 0.75, 8, 4),
        new Material("forge:storage_blocks/zinc", "Zinc", 0.51, 0.77, 1.41, 1)
    ]
];

export { Materials, Material };