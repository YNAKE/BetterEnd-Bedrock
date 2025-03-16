import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:mossy_glowshroom_cap', {
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreak('betterend:mossy_glowshroom_cap');
        },
        onRandomTick({ block }) {
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
        if (wood?.typeId === 'betterend:mossy_glowshroom_wood' || wood?.typeId === 'betterend:mossy_glowshroom_log') {
            block.setPermutation(this.withWood);
        }
        else {
            block.setPermutation(this.withoutWood);
        }
    }
}
