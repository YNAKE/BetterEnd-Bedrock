import { Block, Player, ItemStack, Container, world, Vector3, Dimension, StructureRotation } from "@minecraft/server";

class PlantUtils {
    private block?: Block;
    private player?: Player;
    private inv?: Container;
    private item?: ItemStack;
    constructor(block?: Block, player?: Player) {
        this.block = block;
        this.player = player;
        this.inv = player?.getComponent('inventory').container;
        this.item = this.inv?.getItem(player?.selectedSlotIndex);
    }
    // Random Model
    onPlace(randomModel: number[]) {
        const random = randomModel[Math.floor(Math.random() * randomModel.length)];
        const perm = this.block.permutation.withState('betterend:random', random);
        this.block.setPermutation(perm);

    }
    // On break with shears
    onBreak(itemStack: string) {
        if (this.item?.typeId !== 'minecraft:shears') return;
        const loot = new ItemStack(itemStack);
        this.block.dimension.spawnItem(loot, this.block.location);
    }
    // On break plant with seeds
    onBreakSeeds(seeds: string) {
        const amounts = [ 1, 2 ];
        const nothing = Math.random() < 0.3;
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const loot = new ItemStack(seeds, randomAmount);
        nothing ? this.block.dimension.spawnItem(loot, this.block.location) : null;
    }
    // Plant Grow
    boneMealGrowth(maxState: number, hasStructure: boolean, structures?: string[], offset?: Vector3, removeBlock?: boolean) {
        if (this.item?.typeId !== 'minecraft:bone_meal') return;
        const currentState = this.block?.permutation.getState('betterend:growth') as number;
        if (currentState >= maxState) return;
        this.block.dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: this.block.location.x + 0.5,
            y: this.block.location.y + 0.5,
            z: this.block.location.z + 0.5
        });
        const nextState = currentState + 1;
        const perm = this.block.permutation.withState('betterend:growth', nextState);
        if (nextState === maxState) {
            if (hasStructure) this.loadStructure(structures, this.block?.dimension, offset, removeBlock);
            else this.block.setPermutation(perm);
        }
        else this.block.setPermutation(perm);
    }
    randomTickinigGrowth(maxState: number, hasStructure: boolean, structures?: string[], offset?: Vector3, removeBlock?: boolean) {
        const currentState = this.block?.permutation.getState('betterend:growth') as number;
        if (currentState >= maxState) return;
        this.block.dimension.spawnParticle('minecraft:crop_growth_emitter', {
            x: this.block.location.x + 0.5,
            y: this.block.location.y + 0.5,
            z: this.block.location.z + 0.5
        });
        const nextState = currentState + 1;
        const perm = this.block.permutation.withState('betterend:growth', nextState);
        if (nextState === maxState) {
            if (hasStructure) this.loadStructure(structures, this.block?.dimension, offset, removeBlock);
            else this.block.setPermutation(perm);
        }
        else this.block.setPermutation(perm);
    }
    // Structure Manager
    loadStructure(structures: string[], dimension: Dimension, offset: Vector3, removeBlock?: boolean) {
        const rotations = [
            StructureRotation.None,
            StructureRotation.Rotate180,
            StructureRotation.Rotate270,
            StructureRotation.Rotate90
        ];
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];
        const randomStructure = structures[Math.floor(Math.random() * structures.length)];
        world.structureManager.place(randomStructure, dimension, offset, { rotation });
        removeBlock ? this?.block?.setType('air') : null
    }
}

export default PlantUtils;