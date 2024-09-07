class PlayerUtils {
    constructor(player) {
        this.player = player;
    }
    waila() {
        const block = this.player.getBlockFromViewDirection({ maxDistance: 8 })?.block;
        if (block) {
            this.player.onScreenDisplay.setActionBar(`Id: ${block.typeId}`);
        }
    }
}
export default PlayerUtils;
