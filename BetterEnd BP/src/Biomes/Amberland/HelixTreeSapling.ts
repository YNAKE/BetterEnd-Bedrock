import { world, Block, Player, ItemStack, Vector3 } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

const structures: string[] = [ "amber_tree1", "amber_tree2", "amber_tree3" ];

world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:helix_tree_sapling', {
        onPlayerInteract({ block, player }) {
            const offset: Vector3 = {
                x: block.location.x + -12,
                y: block.location.y + 0,
                z: block.location.z + -9 
            }
            new PlantUtils(block, player).boneMealGrowth(3, true, structures, offset);
        },
        onRandomTick({ block }) {
            const offset: Vector3 = {
                x: block.location.x + -12,
                y: block.location.y + 0,
                z: block.location.z + -9 
            }
            new PlantUtils(block).randomTickinigGrowth(3, true, structures, offset);
        },
    });
});