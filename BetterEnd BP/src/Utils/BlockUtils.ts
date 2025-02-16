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
        const offset = { x: this.loc.x, y: this.loc.y - 10, z: this.loc.z };
        const tags = this.block.getTags();
        const particle = tags.find(e => e.startsWith('particle'));
        const particleId = particle.replace('particle:', '');
        if (particleId.includes('desertic')) {
            const canSpawn = Math.random() < 0.1;
            canSpawn ? this.dim.spawnParticle(particleId, offset) : null;
        }
        else {
            this.dim.spawnParticle(particleId, offset);
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