import { world, Block, Player, ItemStack, BlockPermutation } from "@minecraft/server";
import PlantUtils from "Biomes/PlantsUtils";

const plants = [
    { typeId: 'betterend:cyan_charnia', state: 'None', value: 0 },
    { typeId: 'betterend:red_charnia', state: 'None', value: 0 },
    { typeId: 'betterend:light_blue_charnia', state: 'None', value: 0 },
    { typeId: 'betterend:bubble_coral', state: 'betterend:rotation', value: -1 }
];

world.beforeEvents.worldInitialize.subscribe(data => {
    data.blockComponentRegistry.registerCustomComponent('betterend:plant_generator', {
        onRandomTick({ block }) {
            const { dimension, location } = block;
            const randomPlant = plants[Math.floor(Math.random() * plants.length)];

            if (randomPlant.state === 'None') {
                dimension.setBlockType(location, randomPlant.typeId);
                return; // Salimos temprano para evitar aplicar permutación
            }

            const rotationValue = randomPlant.value === -1 ? Math.floor(Math.random() * 4) : randomPlant.value;
            const perm = BlockPermutation.resolve(randomPlant.typeId, {
                [randomPlant.state]: rotationValue
            });

            dimension.setBlockPermutation(location, perm);
        },
        onTick({ block }) {
            const { dimension, location } = block;
            const randomPlant = plants[Math.floor(Math.random() * plants.length)];

            if (randomPlant.state === 'None') {
                dimension.setBlockType(location, randomPlant.typeId);
                return; // Salimos temprano para evitar aplicar permutación
            }

            const rotationValue = randomPlant.value === -1 ? Math.floor(Math.random() * 4) : randomPlant.value;
            const perm = BlockPermutation.resolve(randomPlant.typeId, {
                [randomPlant.state]: rotationValue
            });

            dimension.setBlockPermutation(location, perm);
        }
    });
});
