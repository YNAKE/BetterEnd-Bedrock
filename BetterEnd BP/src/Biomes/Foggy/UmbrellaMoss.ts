import { world, Block, Player, ItemStack } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

world.beforeEvents.worldInitialize.subscribe((data) => {
  data.blockComponentRegistry.registerCustomComponent("betterend:umbrella_moss", {
    onPlace({ block }) {
      new PlantUtils(block).onPlace([0, 1, 2, 3]);
    },
    onPlayerDestroy({ block, player }) {
      new PlantUtils(block, player).onBreak("betterend:umbrella_moss");
    },
  });
});