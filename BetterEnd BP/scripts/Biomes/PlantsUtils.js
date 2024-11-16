import { ItemStack, world, StructureRotation } from "@minecraft/server";
class PlantUtils {
    constructor(block, player) {
        this.block = block;
        this.player = player;
        this.inv = player?.getComponent('inventory').container;
        this.item = this.inv?.getItem(player?.selectedSlotIndex);
    }
    // Random Model
    onPlace(randomModel) {
        const random = Math.round(Math.random() * randomModel);
        const perm = this.block.permutation.withState('betterend:random', random);
        this.block.setPermutation(perm);
    }
    // On break with shears
    onBreak(itemStack) {
        if (this.item?.typeId !== 'minecraft:shears')
            return;
        const loot = new ItemStack(itemStack);
        this.block.dimension.spawnItem(loot, this.block.location);
    }
    // On break plant with seeds
    onBreakSeeds(seeds) {
        const amounts = [1, 2];
        const nothing = Math.random() < 0.3;
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const loot = new ItemStack(seeds, randomAmount);
        nothing ? this.block.dimension.spawnItem(loot, this.block.location) : null;
    }
    // Plant Grow
    boneMealGrowth(maxState, hasStructure, structures, offset, removeBlock) {
        if (this.item?.typeId !== 'minecraft:bone_meal')
            return;
        const currentState = this.block?.permutation.getState('betterend:growth');
        if (currentState >= maxState)
            return;
        this.block.dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: this.block.location.x + 0.5,
            y: this.block.location.y + 0.5,
            z: this.block.location.z + 0.5
        });
        const nextState = currentState + 1;
        const perm = this.block.permutation.withState('betterend:growth', nextState);
        if (nextState === maxState) {
            if (hasStructure)
                this.loadStructure(structures, this.block?.dimension, offset, removeBlock);
            else
                this.block.setPermutation(perm);
        }
        else
            this.block.setPermutation(perm);
    }
    randomTickinigGrowth(maxState, hasStructure, structures, offset, removeBlock) {
        const currentState = this.block?.permutation.getState('betterend:growth');
        if (currentState >= maxState)
            return;
        this.block.dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: this.block.location.x + 0.5,
            y: this.block.location.y + 0.5,
            z: this.block.location.z + 0.5
        });
        const nextState = currentState + 1;
        const perm = this.block.permutation.withState('betterend:growth', nextState);
        if (nextState === maxState) {
            if (hasStructure)
                this.loadStructure(structures, this.block?.dimension, offset, removeBlock);
            else
                this.block.setPermutation(perm);
        }
        else
            this.block.setPermutation(perm);
    }
    // Structure Manager
    loadStructure(structures, dimension, offset, removeBlock) {
        const rotations = [
            StructureRotation.None,
            StructureRotation.Rotate180,
            StructureRotation.Rotate270,
            StructureRotation.Rotate90
        ];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];
        const randomStructure = structures[Math.floor(Math.random() * structures.length)];
        world.structureManager.place(randomStructure, dimension, offset, { rotation });
        removeBlock ? this?.block?.setType('air') : null;
    }
    // Random Rotation
    randomRotation() {
        const states = [0, 1, 2, 3];
        const randomRot = states[Math.floor(Math.random() * states.length)];
        const perm = this?.block?.permutation.withState('betterend:rotation', randomRot);
        this?.block?.setPermutation(perm);
    }
    // Spawn Particle
    spawnParticle(particleID) {
        const { dimension, location: loc } = this.block;
        dimension.spawnParticle(particleID, { x: loc.x + 0.5, y: loc.y, z: loc.z + 0.5 });
    }
}
export default PlantUtils;
