import { Block, BlockPermutation, world } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe((data) => {
    data.blockComponentRegistry.registerCustomComponent("betterend:neon_cactus", {
        onTick({ block }) {
            const sizeState = (block: Block) => block.permutation?.getState("betterend:sizes");
            const updateState = (block: Block, size: number, rot: string) => {
                block.setPermutation(
                    BlockPermutation.resolve(block.typeId, {
                        "betterend:sizes": size,
                        "minecraft:facing_direction": rot,
                    })
                );
            };

            const rot = block.permutation?.getState("minecraft:facing_direction") as string;
            const sides = [block.north(), block.south(), block.east(), block.west()];
            const tops = [block.above(), block.below()];

            // Procesar bloques laterales
            for (const side of sides) {
                if (side.typeId !== "betterend:neon_cactus") continue;

                const sideState = sizeState(side);
                if (sideState === 0) {
                    updateState(block, 1, rot);
                } else if (sideState === 1) {
                    updateState(block, 1, rot);
                }
            }

            // Procesar bloques superior e inferior
            for (const top of tops) {
                if (top.typeId !== "betterend:neon_cactus") continue;

                const topState = sizeState(top);
                if (topState === 1) {
                    updateState(block, 2, rot);
                } else if (topState === 2) {
                    updateState(block, 2, rot);
                }
            }
        },
    });
});
