import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:mossy_glowshroom_cap', {
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreak('betterend:pythadendron_leaves');
        },
        onTick({ block }) {
            new MossyGlowShroomCap(block).updateTexture();
        }
    });
});
class MossyGlowShroomCap {
    constructor(block) {
        this.block = block;
        this.withWood = block.permutation.withState('betterend:cap', true);
        this.withoutWood = block.permutation.withState('betterend:cap', false);
    }
    updateTexture() {
        const block = this.block;
        const wood = block.below();
        if (wood?.hasTag('betterend:mossy')) {
            block.setPermutation(this.withWood);
        }
        else {
            block.setPermutation(this.withoutWood);
        }
    }
}
