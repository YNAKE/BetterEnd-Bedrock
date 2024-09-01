import { world, Block, Player, ItemStack } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:amber_grass', {
        beforeOnPlayerPlace({ block }) {
            new PlantUtils(block).onPlace();
        },
        onPlayerDestroy({ block }) {
            new PlantUtils(block).onBreak();
        }
    });
});