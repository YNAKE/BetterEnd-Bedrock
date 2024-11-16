import { world, Block, Player, ItemStack, Vector3 } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

const structures: string[] = [ 
    "umbrella_tree1",
    "umbrella_tree2",
    "umbrella_tree3",
    "umbrella_tree4",
    "umbrella_tree5",
    "umbrella_tree6" 
];
const y = [ -2, -3 ];
const randomY = y[Math.floor(Math.random() * y.length)];

world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:umbrella_tree_sapling', {
        onPlayerInteract({ block, player }) {
            const offset: Vector3 = {
                x: block.location.x + -19,
                y: block.location.y + randomY,
                z: block.location.z + -19 
            }
            new PlantUtils(block, player).boneMealGrowth(3, true, structures, offset, true);
        },
        onRandomTick({ block }) {
            const offset: Vector3 = {
                x: block.location.x + -19,
                y: block.location.y + randomY,
                z: block.location.z + -19
            }
            new PlantUtils(block).randomTickinigGrowth(3, true, structures, offset, true);
        },
    });
});