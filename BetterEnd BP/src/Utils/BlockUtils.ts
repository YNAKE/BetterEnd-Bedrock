import { Block, Dimension, MolangVariableMap, Vector3, world } from "@minecraft/server";

class BlockUtils {
    private block: Block;
    private loc: Vector3;
    private dim: Dimension;
    constructor(block: Block) {
        this.block = block;
        this.loc = block.location;
        this.dim = block.dimension;
    }

    particleEmitter() {
        const tags = this.block.getTags();
        const Yoffset = parseInt(tags.find(e => e.startsWith('offset')).split(':')[1]);
        const particle = tags.find(e => e.startsWith('particle')).replace('particle:', '');
        const offset = { x: this.loc.x, y: this.loc.y + Yoffset, z: this.loc.z };
        if (particle.includes('desertic')) {
            const canSpawn = Math.random() < 0.1;
            canSpawn ? this.dim.spawnParticle(particle, offset) : null;
        }
        else {
            this.dim.spawnParticle(particle, offset);
        }
    }
}



world.beforeEvents.worldInitialize.subscribe(e => {
    e.blockComponentRegistry.registerCustomComponent('betterend:particle_emitter', {
        onRandomTick({ block }) {
            new BlockUtils(block).particleEmitter()
        }
    });
});