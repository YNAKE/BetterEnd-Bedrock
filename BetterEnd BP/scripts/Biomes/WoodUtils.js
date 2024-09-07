import { BlockPermutation } from "@minecraft/server";
class WoodUtils {
    constructor(block, player) {
        this.block = block;
        this.player = player;
        this.inv = player?.getComponent('inventory').container;
        this.item = this.inv?.getItem(player?.selectedSlotIndex);
    }
    convertToStripped() {
        if (!this.block?.typeId.startsWith('betterend:'))
            return;
        if (this.block?.typeId.includes('log') || this.block?.typeId.includes('bark')) {
            if (!this.item?.typeId.includes('_axe'))
                return;
            const id = this.block.typeId;
            const rotation = this.block?.permutation.getAllStates();
            const strippedLog = id + '_stripped';
            const perm = BlockPermutation.resolve(strippedLog, rotation);
            this.block?.setPermutation(perm);
        }
    }
}
export default WoodUtils;
