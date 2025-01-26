import { world } from "@minecraft/server";
import WoodUtils from "Biomes/WoodUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:tree_log', {
        onPlayerInteract({ block, player, face }) {
            const woodUtils = new WoodUtils(block, player, face);
            woodUtils.convertToStripped();
        }
    });
});
