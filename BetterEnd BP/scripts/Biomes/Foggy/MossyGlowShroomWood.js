import { world } from "@minecraft/server";
import WoodUtils from "Biomes/WoodUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:mossy_glowshroom_wood', {
        onPlace({ block }) {
            const woodUtils = new WoodUtils(block);
            woodUtils.textureVariation([0, 1, 2, 3, 4]);
        }
    });
});
