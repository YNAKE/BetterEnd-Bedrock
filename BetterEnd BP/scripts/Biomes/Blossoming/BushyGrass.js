import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:bushy_grass', {
        onPlace({ block }) {
            new PlantUtils(block).onPlace([0, 1]);
        },
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreak('betterend:bushy_grass');
        }
    });
});
