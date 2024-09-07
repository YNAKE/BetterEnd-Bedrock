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
            const strippedLog = id + '_stripped';
            this.block?.setType(strippedLog);
        }
    }
}
export default WoodUtils;
