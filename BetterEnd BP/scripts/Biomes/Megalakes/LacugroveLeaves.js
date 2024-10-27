import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:lacugrove_leaves', {
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreak('betterend:lacugrove_leaves');
        }
    });
});
