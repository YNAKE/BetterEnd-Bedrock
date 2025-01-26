import { BlockPermutation } from "@minecraft/server";
class WoodUtils {
    constructor(block, player, face) {
        this.block = block;
        this.player = player;
        this.face = face;
        this.inv = player?.getComponent('inventory').container;
        this.item = this.inv?.getItem(player?.selectedSlotIndex);
    }
    convertToStripped() {
        if (!this.block?.typeId.startsWith('betterend:'))
            return;
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
                    let position;
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
    textureVariation(maxVartiations) {
        if (!this.block?.typeId.startsWith('betterend:'))
            return;
        const randomVariation = maxVartiations[Math.floor(Math.random() * maxVartiations.length)];
        const perm = this.block.permutation.withState('betterend:variations', randomVariation);
        this.block?.setPermutation(perm);
    }
    itemStackUpdater(typeId, amount) {
    }
}
export default WoodUtils;
