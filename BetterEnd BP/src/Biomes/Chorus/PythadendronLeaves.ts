import { world, Block, Player, ItemStack } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:pythadendron_leaves', {
        onPlayerDestroy({ block, player }) {
            new PlantUtils(block, player).onBreak('betterend:pythadendron_leaves');
        }
    });
});