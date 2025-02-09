import { world, system, ItemStack, BlockPermutation } from '@minecraft/server';
import { randomTickComponent, OnTickComponent, leafDrop } from "./OnTick"
import { treeInteractComponent, leafDefaultComponent } from './tree';
import { FenceInteractComponent, PlaceComponent, PlaceGateComponent, GateInteract } from './fence';
import { slabComponent } from './slabs';
import 'door'
import 'trapdoor'
import 'fallingLeaves'

// Add more mappings here as needed - Note, the doors need to be set on door.js at line 237.
const isSlab = new Set([
  "betterend:white_oak_slab",
  "betterend:orange_tree_slab",
  "betterend:orange_tree_slab_item",
  "betterend:white_oak_slab_item"
]);
const fenceSet = new Set([
  "betterend:white_oak_fence",
  "betterend:white_oak_fence_gate",
  "betterend:orange_tree_fence",
  "betterend:orange_tree_fence_gate"
]);
export const gateSet = new Set(
  Array.from(fenceSet).filter(item => item.includes("_gate"))
);
const fenceMap = new Map([
  ["betterend:orange_tree_fence", "betterend:orange_tree_fence"],
  ["betterend:orange_tree_fence_inventory", "betterend:orange_tree_fence"],
  ["betterend:white_oak_fence_inventory", "betterend:white_oak_fence"],
  ["betterend:orange_tree_fence_inventory_item", "betterend:orange_tree_fence"],
  ["betterend:white_oak_fence_inventory_item", "betterend:white_oak_fence"],
  ["betterend:white_oak_fence", "betterend:white_oak_fence"]
]);
const leafSet = new Set([
  "betterend:white_oak_leaves",
  "betterend:orange_tree_leaves"
]);
const fruitSet = new Set([
  "betterend:orange_tree_leaves"
]);
const leafDropMap = new Map([
  ["betterend:orange_tree_leaves", "betterend:orange_tree_sapling"],
  ["betterend:white_oak_leaves", "betterend:custom_sapling_placer"]
]);
const saplingBlocks = [
  {
    blockID: "betterend:white_oak_sapling",
    maxStage: 2,
    growChance: {
      numerator: 1,
      denominator: 3
    }
  },
  {
    blockID: "betterend:orange_tree_sapling",
    maxStage: 2,
    growChance: {
      numerator: 1,
      denominator: 3
    }
  },
  {
    blockID: "betterend:orange_tree_leaves",
    maxStage: 3,
    growChance: {
      numerator: 1,
      denominator: 7 // adjust this to adjust speed of fruit growth
    }
  }
  // Add other sapling types here
];
const logSet = new Set([
  "betterend:white_oak_log",
  "betterend:orange_tree_log"
]);
const sapSet = new Set([
  "betterend:white_oak_sapling",
  "betterend:orange_tree_sapling"
]);
const logMap = new Map([
  ["betterend:orange_tree_log", "betterend:stripped_orange_tree_log"],
  ["betterend:white_oak_log", "betterend:stripped_white_oak_log"],
  ["betterend:orange_tree_wood", "betterend:stripped_orange_tree_wood"],
  ["betterend:white_oak_wood", "betterend:stripped_white_oak_wood"]
]);
const trapSet = new Set([
  "betterend:white_oak_trapdoor",
  "betterend:orange_tree_trapdoor"
]);

// This handles the durality damage for all blocks (except slabs - handled in slabs.js) and removing the block above for fences and gates
const DestroyComponent = {
  onPlayerDestroy(e) {
    const { block, player } = e;
    const aboveBlock = block.above();
    const blockBelow = block.below();

    // Remove betterend:fence_inventory or invisible fence gate on top if present
    if ((aboveBlock.typeId.includes("_inventory")) || (fenceSet.has(aboveBlock.typeId) && aboveBlock.permutation.getState('betterend:invisible'))) {
      aboveBlock.setType("minecraft:air");
    }

    // add betterend:fence_inventory if fence present below
    if (fenceSet.has(blockBelow.typeId)) {
      block.setPermutation(
        BlockPermutation.resolve("betterend:white_oak_fence_inventory", { "betterend:post": 1 })
      );
    }
    const inventory = player.getComponent("inventory");
    const selectedItem = inventory.container.getItem(player.selectedSlotIndex);
    if (
      selectedItem &&
      (selectedItem.typeId.includes("shovel") ||
        selectedItem.typeId.includes("hoe") ||
        selectedItem.typeId.includes("_axe") ||
        selectedItem.typeId.includes("_pickaxe") ||
        selectedItem.typeId.includes("shears"))
    ) {
      system.runTimeout(() => {
        applyDurabilityDamage(
          player,
          selectedItem,
          inventory,
          player.selectedSlotIndex
        );
      }, 1);
    } 
  },
};

const customComponents = {
  "betterend:fence_interact": FenceInteractComponent,
  "betterend:on_player_destroy": DestroyComponent,
  "betterend:on_tick": OnTickComponent,
  "betterend:on_player_placed": PlaceComponent,
  "betterend:random_tick": randomTickComponent,
  "betterend:slab_interact": slabComponent,
  "betterend:interact_tree": treeInteractComponent,
  "betterend:gate_interact": GateInteract,
  "betterend:gate_placed": PlaceGateComponent,
  "betterend:leaf_place": leafDefaultComponent
};

let lastBrokenBlockType = null;
let lastBrokenBlockIsDouble = false;

// Use this world initialization event to register all custom components
world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
  for (const [componentName, componentImplementation] of Object.entries(customComponents)) {
    blockComponentRegistry.registerCustomComponent(componentName, componentImplementation);
  }
});

world.beforeEvents.playerBreakBlock.subscribe((eventData) => {
  const { block, player, dimension } = eventData;
  const blockBelow = block.below();
  const inventory = player.getComponent("inventory");
  const selectedItem = inventory.container.getItem(player.selectedSlotIndex);
  const { hasSilkTouch } = getRelevantEnchantments(selectedItem);

  if (selectedItem && leafSet.has(block.typeId) && selectedItem.typeId ===  "minecraft:shears" && !hasSilkTouch) {
    const spawnItem = block.typeId;
    system.runTimeout(() => {
      block.dimension.spawnItem(new ItemStack(spawnItem, 1), block.location);
    }, 1);
  } else if(leafSet.has(block.typeId) && !hasSilkTouch){
    leafDrop(block, true);
  }

  if (isSlab.has(block.typeId)) {
    lastBrokenBlockType = block.typeId + "_item";
    lastBrokenBlockIsDouble =
      block.permutation.getState("betterend:double") === true;
  system.runTimeout(() => {
    if (!selectedItem) {
      slabDrop(block, dimension, player);
      
    } else if (
      selectedItem.typeId.includes("shovel") ||
      selectedItem.typeId.includes("hoe") ||
      selectedItem.typeId.includes("_axe") ||
      selectedItem.typeId.includes("_pickaxe")
    ) {
      applyDurabilityDamage(
        player,
        selectedItem,
        inventory,
        player.selectedSlotIndex
      );
      slabDrop(block, dimension, player);
    } else {
      slabDrop(block, dimension, player);
    }
  }, 1);
} else if (fenceSet.has(blockBelow.typeId)) {
  system.runTimeout(() => {
      if (blockBelow.typeId.includes("betterend:") && blockBelow.typeId.includes("_gate")) {
        const currentStates = blockBelow.permutation.getAllStates();

        const cardinalDirection = currentStates['minecraft:cardinal_direction'];
            const newAboveStates = { ...currentStates };
            if (cardinalDirection === 'south') {
                delete newAboveStates['minecraft:cardinal_direction'];
            }
            newAboveStates['betterend:invisible'] = true;
            block.setPermutation(BlockPermutation.resolve(blockBelow.typeId, newAboveStates));
          
      } else if (blockBelow.typeId.includes("betterend:") && !blockBelow.typeId.includes("_gate")) {
        block.setPermutation(
          BlockPermutation.resolve("betterend:white_oak_fence_inventory", { "betterend:post": 1 })
        );
      }
  }, 1);
  } 
});

function slabDrop(block, dimension, player) {
  if (player.getGameMode() !== "creative") {
    if (lastBrokenBlockType) {
      const blockData = lastBrokenBlockType;
  
      if (blockData) {
        let dropItem;
  
        if (
          lastBrokenBlockIsDouble
        ) {
          dropItem = new ItemStack(lastBrokenBlockType, 1);
        } 
        if (dropItem) {
          dimension.spawnItem(dropItem, block.location);
        }
      }
      lastBrokenBlockType = null;
      lastBrokenBlockIsDouble = false;
    }
  }
}

function applyDurabilityDamage(player, item, inventory, slotIndex) {
  const durabilityComponent = item.getComponent("minecraft:durability");
  if (durabilityComponent) {
    const { unbreakingLevel } = getRelevantEnchantments(item);
    
    if (Math.random() < 1 / (unbreakingLevel + 1)) {
      const newDamage = durabilityComponent.damage + 1;
      if (newDamage >= durabilityComponent.maxDurability) {
        inventory.container.setItem(slotIndex, undefined);
        player.playSound("random.break");
      } else {
        durabilityComponent.damage = newDamage;
        inventory.container.setItem(slotIndex, item);
      }
    }
  }
}

function getRelevantEnchantments(item) {
  let unbreakingLevel = 0;
  let hasSilkTouch = false;

  try {
      const enchantableComponent = item.getComponent("minecraft:enchantable");
      if (enchantableComponent) {
          const enchantments = enchantableComponent.getEnchantments();
          for (const enchant of enchantments) {
              if (enchant.type.id === "unbreaking") {
                  unbreakingLevel = enchant.level;
              } else if (enchant.type.id === "silk_touch") {
                  hasSilkTouch = true;
              }
          }
      }
  } catch (error) {
  }
  return { unbreakingLevel, hasSilkTouch };
}



export {
  applyDurabilityDamage,
  getRelevantEnchantments,
  isSlab,
  fenceSet,
  fenceMap,
  leafSet,
  leafDropMap,
  saplingBlocks,
  logSet,
  sapSet,
  logMap,
  trapSet,
  fruitSet
}