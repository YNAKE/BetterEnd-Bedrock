import { Block, Player, ItemStack, Container } from "@minecraft/server";

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
}

export default PlantUtils;