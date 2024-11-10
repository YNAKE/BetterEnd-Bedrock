import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:charnia', {
        onPlace({ block }) {
            new PlantUtils(block).randomRotation();
        }
    });
});
