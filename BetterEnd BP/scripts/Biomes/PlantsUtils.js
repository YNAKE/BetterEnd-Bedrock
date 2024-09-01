import { ItemStack } from "@minecraft/server";
class PlantUtils {
    constructor(block, player) {
        this.block = block;
        this.player = player;
        this.inv = player?.getComponent('inventory').container;
        this.item = this.inv?.getItem(player?.selectedSlotIndex);
    }
    // Random Model
    onPlace(randomModel) {
        const random = randomModel[Math.floor(Math.random() * randomModel.length)];
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
}
export default PlantUtils;
