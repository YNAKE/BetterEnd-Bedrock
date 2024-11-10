import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:bubble_coral', {
        onPlace({ block }) {
            new PlantUtils(block).randomRotation();
        }
    });
});
