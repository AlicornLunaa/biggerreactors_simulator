import { Material } from "./Materials";

/**
 * This is a generic class defining a reactor, agnostic to game version.
 * It will be serializable and will define how to create a reactor
 * from the ported java code for each version.
 */
export default class GenericReactor {
    // Variables
    width: number;
    depth: number;
    height: number;
    blocks: Material[];

    // Constructor
    constructor(){
        this.width = 3;
        this.depth = 3;
        this.height = 3;
        this.blocks = [];
    }
    
    // Functions


    // JSON Interface
    public static parse(data: string): GenericReactor {
        let plainInterface = JSON.parse(data) as GenericReactor;
        let reactor = new GenericReactor();

        reactor.width = plainInterface.width;
        reactor.depth = plainInterface.depth;
        reactor.height = plainInterface.height;

        for(let block of plainInterface.blocks){
            reactor.blocks.push(block);
        }

        return reactor;
    }
};