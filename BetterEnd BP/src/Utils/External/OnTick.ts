import { system, ItemStack } from '@minecraft/server';
import { growTree, getGrowthStage } from './tree';
import { saplingBlocks, logSet, leafSet, leafDropMap, sapSet } from './main';


// Initialize a Map to store the state of each block for tracking changes
const blockStates = new Map();
export const OnTickComponent = {
  onTick(e) {
    // Destructure event data for easier access
    const { block } = e;

    // Get adjacent blocks
    const north = block.north();
    const east = block.east();
    const south = block.south();
    const west = block.west();

    // Define an array of block types to exclude from connections
    const excludeBlocksArray = [
    "minecraft:air",
    "minecraft:wooden_door",
    "minecraft:iron_door",
    "minecraft:acacia_door",
    "minecraft:birch_door",
    "minecraft:crimson_door",
    "minecraft:dark_oak_door",
    "minecraft:jungle_door",
    "minecraft:oak_door",
    "minecraft:spruce_door",
    "minecraft:warped_door",
    "minecraft:mangrove_door",
    "minecraft:cherry_door",
    "minecraft:bamboo_door",
    "minecraft:iron_trapdoor",
    "minecraft:acacia_trapdoor",
    "minecraft:birch_trapdoor",
    "minecraft:crimson_trapdoor",
    "minecraft:dark_oak_trapdoor",
    "minecraft:jungle_trapdoor",
    "minecraft:oak_trapdoor",
    "minecraft:spruce_trapdoor",
    "minecraft:warped_trapdoor",
    "minecraft:mangrove_trapdoor",
    "minecraft:cherry_trapdoor",
    "minecraft:bamboo_trapdoor",
    "minecraft:trapdoor",
    "minecraft:glass_pane",
    "minecraft:stained_glass",
    "minecraft:stained_glass_pane",
    "minecraft:blue_ice",
    "minecraft:ice",
    "minecraft:packed_ice",
    "minecraft:conduit",
    "minecraft:water",
    "minecraft:lava",
    "minecraft:flowing_lava",
    "minecraft:flowing_water",
    "minecraft:stationary_water",
    "minecraft:stationary_lava",
    "minecraft:oak_slab",
    "minecraft:stone_slab",
    "minecraft:spruce_slab",
    "minecraft:stone_slab2",
    "minecraft:brick_slab",
    "minecraft:stone_brick_slab",
    "minecraft:nether_brick_slab",
    "minecraft:sandstone_slab",
    "minecraft:smooth_sandstone_slab",
    "minecraft:quartz_slab",
    "minecraft:acacia_slab",
    "minecraft:birch_slab",
    "minecraft:jungle_slab",
    "minecraft:dark_oak_slab",
    "minecraft:warped_slab",
    "minecraft:crimson_slab",
    "minecraft:mangrove_slab",
    "minecraft:cherry_slab",
    "minecraft:bamboo_slab",
    "minecraft:stone_stairs",
    "minecraft:oak_stairs",
    "minecraft:spruce_stairs",
    "minecraft:stone_brick_stairs",
    "minecraft:brick_stairs",
    "minecraft:nether_brick_stairs",
    "minecraft:quartz_stairs",
    "minecraft:acacia_stairs",
    "minecraft:birch_stairs",
    "minecraft:jungle_stairs",
    "minecraft:dark_oak_stairs",
    "minecraft:warped_stairs",
    "minecraft:crimson_stairs",
    "minecraft:mangrove_stairs",
    "minecraft:cherry_stairs",
    "minecraft:bamboo_stairs",
    "minecraft:fire",
    "minecraft:carpet",
    "minecraft:ladder",
    "minecraft:vine",
    "minecraft:waterlily",
    "minecraft:ladder",
    "minecraft:chest",
    "minecraft:trapdoor",
    "minecraft:leaves",
    "minecraft:snow_layer",
    "minecraft:bed",
    "minecraft:cactus",
    "minecraft:flower_pot",
    "minecraft:banner",
    "minecraft:painting",
    "minecraft:armor_stand",
    "minecraft:flower_pot",
    "minecraft:torches",
    "minecraft:lantern",
    "minecraft:chest",
    "minecraft:trapped_chest",
    "minecraft:hopper",
    "minecraft:composter",
    "minecraft:shulker_box",
    "minecraft:enchanting_table",
    "minecraft:anvil",
    "minecraft:beacon",
    "minecraft:stonecutter",
    "minecraft:sapling",  // Planta
    "minecraft:melon_stem",  // Planta
    "minecraft:pumpkin_stem",  // Planta
    "minecraft:wheat",  // Planta
    "minecraft:beetroots",  // Planta
    "minecraft:carrots",  // Planta
    "minecraft:potatoes",  // Planta
    "minecraft:sweet_berries",  // Planta
    "minecraft:nether_wart",  // Planta
    "minecraft:waterlily",  // Planta
    "minecraft:fern",  // Planta
    "minecraft:tall_grass",  // Grama alta
    "minecraft:short_grass",  // Grama baixa
    "minecraft:dandelion",  // Flor
    "minecraft:poppy",  // Flor
    "minecraft:blue_orchid",  // Flor
    "minecraft:allium",  // Flor
    "minecraft:azure_bluet",  // Flor
    "minecraft:red_tulip",  // Flor
    "minecraft:orange_tulip",  // Flor
    "minecraft:white_tulip",  // Flor
    "minecraft:pink_tulip",  // Flor
    "minecraft:oxeye_daisy",  // Flor
    "minecraft:sunflower",  // Flor
    "minecraft:lilac",  // Flor
    "minecraft:rose_bush",  // Flor
    "minecraft:peony",  // Flor
    "minecraft:cornflower",  // Flor
    "minecraft:lily_of_the_valley",  // Flor
    "minecraft:wither_rose",  // Flor
    "minecraft:large_fern",  // Fern grande
    "minecraft:large_tulip",  // Tulipa grande
    "minecraft:large_sunflower",  // Girassol grande
    "minecraft:large_lilac",  // Lilás grande
    "minecraft:large_rose_bush",  // Rosa grande
    "minecraft:large_peony",  // Peônia grande
    "minecraft:eyeblossom",  // Eyeblossom
    "minecraft:banner",
    "minecraft:painting",
    "minecraft:item_frame",
    "minecraft:glow_item_frame",
    "minecraft:end_portal_frame",
    "minecraft:end_gateway",
    "minecraft:moss_carpet", // Tapete de musgo
    "minecraft:stone_wall", // Muro de pedra
    "minecraft:undyed_shulker_box", // Shulker Box sem cor
    "minecraft:white_shulker_box", // Shulker Box Branco
    "minecraft:orange_shulker_box", // Shulker Box Laranja
    "minecraft:magenta_shulker_box", // Shulker Box Magenta
    "minecraft:light_blue_shulker_box", // Shulker Box Azul Claro
    "minecraft:yellow_shulker_box", // Shulker Box Amarelo
    "minecraft:lime_shulker_box", // Shulker Box Lima
    "minecraft:pink_shulker_box", // Shulker Box Rosa
    "minecraft:gray_shulker_box", // Shulker Box Cinza
    "minecraft:silver_shulker_box", // Shulker Box Prata
    "minecraft:blue_shulker_box", // Shulker Box Azul
    "minecraft:purple_shulker_box", // Shulker Box Roxo
    "minecraft:cyan_shulker_box", // Shulker Box Ciano
    "minecraft:green_shulker_box", // Shulker Box Verde
    "minecraft:red_shulker_box", // Shulker Box Vermelho
    "minecraft:black_shulker_box", // Shulker Box Preto
    "minecraft:stone_pressure_plate", // Placa de pedra
    "minecraft:wooden_pressure_plate", // Placa de madeira
    "minecraft:light_weighted_pressure_plate", // Placa de pressão leve
    "minecraft:heavy_weighted_pressure_plate", // Placa de pressão pesada
    "minecraft:pale_oak_stairs", // Escada de Pale Oak
    "minecraft:pale_oak_slab", // Laje de Pale Oak
    "minecraft:pale_oak_trapdoor", // Trapdoor de Pale Oak
    "minecraft:cobblestone_wall",
    "minecraft:nether_brick_fence",
    "betterend:dragon_tree_fence_inventory",
    "betterend:helix_tree_fence_inventory",
    "betterend:jellyshroom_inventory",
    "betterend:lacugrove_fence_inventory",
    "betterend:lucernia_fence_inventory",
    "betterend:mossy_glowshroom_fence_inventory",
    "betterend:pythadendron_fence_inventory",
    "betterend:tenanea_fence_inventory",
    "betterend:umbrella_tree_fence_inventory",
    "betterend:end_lotus_fence_inventory",
    "mc:leshy_door",
    "mc:grassy_leshy_door",
    "mc:leshy_trapdoor",
    "mc:grassy_leshy_trapdoor",
];

    // Check if the adjacent block is not in the excludeBlocksArray
    const northConnects = !excludeBlocksArray.includes(north?.typeId);
    const eastConnects = !excludeBlocksArray.includes(east?.typeId);
    const southConnects = !excludeBlocksArray.includes(south?.typeId);
    const westConnects = !excludeBlocksArray.includes(west?.typeId);

    // Update block states based on the presence of adjacent blocks
    block.setPermutation(
      block.permutation.withState("betterend:north_picket", northConnects ? 1 : 0)
    );
    block.setPermutation(
      block.permutation.withState("betterend:south_picket", southConnects ? 1 : 0)
    );
    block.setPermutation(
      block.permutation.withState("betterend:east_picket", eastConnects ? 1 : 0)
    );
    block.setPermutation(
      block.permutation.withState("betterend:west_picket", westConnects ? 1 : 0)
    );
  },
};

export const randomTickComponent = {
  onRandomTick(e) {
    const { block, dimension } = e;
    
    if (sapSet.has(block.typeId)) {
      handleSaplingGrowth(block, dimension);
    } else if (leafSet.has(block.typeId)) {
      handleLeafDecay(block, dimension);
    } 
  }
};

function randomNum(min, max) {
  //return a random number
  return Math.random() * (max - min) + min;
}

function handleSaplingGrowth(block, dimension) {
  const data = saplingBlocks.find((f) => f.blockID === block.typeId);
  if (!data) return;

  const stage = getGrowthStage(block);
  if (stage >= data.maxStage) return;

  const num = randomNum(0, data.growChance.denominator);
  if (num > data.growChance.numerator) return;

  const newStage = stage + 1;
  block.setPermutation(block.permutation.withState("betterend:growth_stage", newStage));

  if (newStage === data.maxStage) {
    growTree(block, dimension);
  }
}

function handleLeafDecay(block, dimension) {
  const shouldDecay = block.permutation.getState("betterend:should_decay");
  if (!shouldDecay) return;

  const currentTier = block.permutation.getState("betterend:decay_tier") || 0;

  const newDecayTier = getNewDecayTier(block, dimension, currentTier);
  
  if (newDecayTier === 0) {
    // leafDrop(block);
  } else if (newDecayTier !== currentTier) {
    block.setPermutation(block.permutation.withState("betterend:decay_tier", newDecayTier));
  }
}

function getNewDecayTier(block, dimension, currentTier) {
  // Check for nearby logs first
  if (hasNearbyLog(block, dimension, 15)) {
    return currentTier; 
  }

  let num = Math.random();
  // Control decay speed with this, only if no logs are nearby
  if (num > 0.4) { // 40% chance to decay 1 stage
    return Math.max(0, currentTier - 1);
  } else if (num < 0.6) { // 60% chance to decay fully
    // leafDrop(block);
  }

  return currentTier;
}

function hasNearbyLog(block, dimension, radius) {
  return false;
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const checkLocation = {
          x: block.location.x + dx,
          y: block.location.y + dy,
          z: block.location.z + dz
        };
        const checkBlock = dimension.getBlock(checkLocation);
        if (checkBlock && logSet.has(checkBlock.type.id)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function leafDrop(block, broken) {
  const leafType = block.type.id;
  const dropLocation = block.location;
  const saplingType = leafDropMap.get(leafType);
  const randomValue = Math.random();


  if (randomValue < 0.02) {
    // 2% chance to drop a sapling
    if (saplingType) {
    system.runTimeout(() => {
      block.dimension.spawnItem(new ItemStack(saplingType, 1), dropLocation);
  },1);
}
  } else if (randomValue > 0.95) {
    // 5% chance to drop sticks 
    system.runTimeout(() => {
      block.dimension.spawnItem(new ItemStack("minecraft:stick", 1), dropLocation);
  },1);
  }
  // 93% chance to drop nothing 

  if (!broken) {
    // Remove the leaf block if it decayed natually, skip if player broken. 
  block.setType("minecraft:air");
  }
}

// this function looks if there is an air block to the sides before advancing growth of the fruit
function isAir(block, dim) {
  const directions = ["North", "South", "East", "West"];
  for (const direction of directions) {
    let adjacentBlockPos;
    switch (direction) {
      case "North":
        adjacentBlockPos = {
          x: block.location.x,
          y: block.location.y,
          z: block.location.z - 1,
        };
        break;
      case "South":
        adjacentBlockPos = {
          x: block.location.x,
          y: block.location.y,
          z: block.location.z + 1,
        };
        break;
      case "East":
        adjacentBlockPos = {
          x: block.location.x + 1,
          y: block.location.y,
          z: block.location.z,
        };
        break;
      case "West":
        adjacentBlockPos = {
          x: block.location.x - 1,
          y: block.location.y,
          z: block.location.z,
        };
        break;
    }

    try {
      const adjacentBlock = dim.getBlock(adjacentBlockPos);
      if (adjacentBlock.typeId === "minecraft:air") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.warn(`Error: ${error}`);
    }
  }
}