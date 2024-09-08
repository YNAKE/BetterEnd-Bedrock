import { world } from "@minecraft/server";
import WoodUtils from "Biomes/WoodUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:log_variation', {
        onPlayerInteract({ block, player }) {
            const woodUtils = new WoodUtils(block, player);
            woodUtils.textureVariation([0, 1]);
        }
    });
});
