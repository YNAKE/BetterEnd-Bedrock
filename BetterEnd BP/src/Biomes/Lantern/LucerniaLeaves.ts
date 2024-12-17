import { world, Block, Player, ItemStack } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:lucernia_leaves', {
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreak('betterend:lucernia_leaves');
        }
    });
});