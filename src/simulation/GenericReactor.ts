import { Material, Materials } from "./Materials";
import SimulationDescription from "./reactors/1_19/SimulationDescription";
import TimeSlicedReactorSimulation from "./reactors/1_19/TimeSlicedReactorSimulation";

/**
 * This is a generic class defining a reactor, agnostic to game version.
 * It will be serializable and will define how to create a reactor
 * from the ported java code for each version.
 */
export default class GenericReactor {
    // Variables
    private blocks: { [key: string]: Material|null };

    public version: string;
    public width: number;
    public depth: number;
    public height: number;

    // Constructor
    constructor(){
        this.version = "1.20"
        this.width = 3;
        this.depth = 3;
        this.height = 3;
        this.blocks = {};
    }
    
    // Functions
    public clear(){
        this.blocks = {};
    }

    public set_block(x: number, y: number, material: Material){
        this.blocks[`${x} ${y}`] = material;
    }

    public get_block(x: number, y: number){
        let b = this.blocks[`${x} ${y}`];

        if(!b){
            b = Materials[this.version]["minecraft:air"];
        }

        if(!b){
            b = Material.EMPTY_MODERATOR;
        }

        return b;
    }

    public get_simulation(){
        let desc = new SimulationDescription();
        desc.setSize(this.width, this.depth, this.height);

        for(let x = 0; x < this.width; x++){
            for(let z = 0; z < this.depth; z++){
                let block = this.get_block(x, z);

                if(block.id == "biggerreactors:fuel_rod"){
                    // Yummy fun rods
                    desc.setControlRod(x, z, true);
                    continue;
                }

                desc.setControlRod(x, z, false);

                for(let y = 0; y < this.height; y++){
                    desc.setModeratorProperties(x, y, z, block);
                }
            }
        }

        return new TimeSlicedReactorSimulation(desc);
    }

    // JSON Interface
    public static parse(data: string): GenericReactor {
        let plainInterface = JSON.parse(data) as GenericReactor;
        let reactor = new GenericReactor();

        reactor.version = plainInterface.version;
        reactor.width = plainInterface.width;
        reactor.depth = plainInterface.depth;
        reactor.height = plainInterface.height;

        for(let key in plainInterface.blocks){
            reactor.blocks[key] = plainInterface.blocks[key];
        }

        return reactor;
    }
};