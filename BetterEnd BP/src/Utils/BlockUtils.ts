import { Block, Dimension, Vector3 } from "@minecraft/server";

class BlockUtils {
    private block: Block;
    private loc: Vector3;
    private dim: Dimension;
    constructor(block: Block) {
        this.block = block;
        this.loc = block.location;
        this.dim = block.dimension;
    }
}