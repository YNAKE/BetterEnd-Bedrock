import { Block, Player, ItemStack, Container, BlockPermutation, Vector3, Direction } from "@minecraft/server";

class WoodUtils {
    private block?: Block;
    private player?: Player;
    private face?: Direction;
    private inv?: Container;
    private item?: ItemStack;
    constructor(block?: Block, player?: Player, face?: Direction) {
        this.block = block;
        this.player = player;
        this.face = face;
        this.inv = player?.getComponent('inventory').container;
        this.item = this.inv?.getItem(player?.selectedSlotIndex);
    }

    convertToStripped() {
        if (!this.block?.typeId.startsWith('betterend:')) return;
        if (this.block?.typeId.includes('log') || this.block?.typeId.includes('bark')) {
            if (this.item?.typeId.includes('_axe')) {
                const id = this.block.typeId;
                const rotation = this.block?.permutation.getAllStates();
                const strippedLog = id + '_stripped';
                const perm = BlockPermutation.resolve(strippedLog, rotation);
                this.block?.setPermutation(perm);
            }
            else {
                if (this.item) {
                    let position: Vector3;
                    const loc = this.block.location;
                    switch (this.face) {
                        case "North":
                            position = { x: loc.x, y: loc.y, z: loc.z - 1 };
                            break;
                        case "South":
                            position = { x: loc.x, y: loc.y, z: loc.z + 1 };
                            break;
                        case "East":
                            position = { x: loc.x + 1, y: loc.y, z: loc.z };
                            break;
                        case "West":
                            position = { x: loc.x - 1, y: loc.y, z: loc.z };
                            break;
                        case "Up":
                            position = { x: loc.x, y: loc.y + 1, z: loc.z };
                            break;
                        case "Down":
                            position = { x: loc.x, y: loc.y - 1, z: loc.z };
                            break;
                    }
                    this.player.dimension.setBlockType(position, this.item.typeId);
                }
            }
        }
    }

    textureVariation(maxVartiations: number[]) {
        if (!this.block?.typeId.startsWith('betterend:')) return;
        const randomVariation = maxVartiations[Math.floor(Math.random() * maxVartiations.length)];
        const perm = this.block.permutation.withState('betterend:variations', randomVariation);
        this.block?.setPermutation(perm);
    }

    private itemStackUpdater(typeId: string, amount: number) {

    }
}

export default WoodUtils;