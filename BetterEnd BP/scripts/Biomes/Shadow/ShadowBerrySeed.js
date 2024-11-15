import { world } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";
world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:shadow_berry_seed', {
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreakSeeds('betterend:shadow_berry_seed');
        },
        onPlayerInteract({ block, player }) {
            new PlantUtils(block, player).boneMealGrowth(3, false, null, null, false);
        },
        onRandomTick({ block }) {
            new PlantUtils(block).randomTickinigGrowth(3, false, null, null, false);
        },
        onPlace({ block }) {
            new PlantUtils(block).randomRotation();
        }
    });
});
