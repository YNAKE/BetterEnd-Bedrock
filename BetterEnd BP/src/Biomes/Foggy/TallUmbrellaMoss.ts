import { world, Block, Player, ItemStack, BlockPermutation } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

world.beforeEvents.worldInitialize.subscribe((data) => {
  data.blockComponentRegistry.registerCustomComponent("betterend:tall_umbrella_moss", {
    beforeOnPlayerPlace(args) {
      const { block } = args;
      const upBlockLoc = {
        x: block.location.x,
        y: block.location.y + 1,
        z: block.location.z,
      };
      const upBlock = block.dimension.getBlock(upBlockLoc);

      if (upBlock?.typeId === "minecraft:air") {
        upBlock.setPermutation(
          BlockPermutation.resolve(args.permutationToPlace.type.id, {
            ...block.permutation.getAllStates(),
            "betterend:top": true,
            "betterend:random": Math.floor(Math.random() * 3),
          })
        );
      } else {
        args.cancel = true;
      }
    },
    onPlace({ block }) {
      //   const upBlockLoc = {
      //     x: block.location.x,
      //     y: block.location.y + 1,
      //     z: block.location.z,
      //   };
      //   const upBlock = block.dimension.getBlock(upBlockLoc);
      //   if (upBlock?.typeId === "betterend:tall_umbrella_moss") {
      //     new PlantUtils(upBlock).onPlace([0, 1, 2]);
      //   }
    },
    onPlayerDestroy({ block, destroyedBlockPermutation, player }) {
      new PlantUtils(block, player).onBreak("betterend:tall_umbrella_moss");
      block.dimension.runCommand(
        `setblock ${block.location.x} ${
          block.location.y + (destroyedBlockPermutation.getState("betterend:top") ? -1 : 1)
        } ${block.location.z} air destroy`
      );
    },
  });
});
