import { ItemStack } from "@minecraft/server";
class PlantUtils {
    constructor(block, player, item) {
        this.block = block;
        this.player = player;
        this.item = item;
    }
    // Random Model
    onPlace() {
        const randomModel = [0, 1];
        const random = randomModel[Math.floor(Math.random() * randomModel.length)];
        console.warn(random);
    }
    // On break with shears
    onBreak() {
        if (this.item?.typeId !== 'minecraft:shears')
            return;
        const loot = new ItemStack(this.block.typeId);
        this.block.dimension.spawnItem(loot, this.block.location);
    }
}
export default PlantUtils;
