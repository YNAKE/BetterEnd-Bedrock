import { Player } from "@minecraft/server";

Player.prototype.climb = function () {
  const block = this.dimension.getBlock(this.location);
  if (!block?.hasTag("betterend:can_climb")) return;

  this.isJumping && !this.isSneaking
    ? this.applyKnockback(0, 0, 0, 0.2)
    : this.applyKnockback(0, 0, 0, -0.06);

  if (this.isSneaking && !this.isJumping) {
    this.applyKnockback(0, 0, 0, 0.04);
  }
};

class PlayerUtils {
  private player: Player;
  constructor(player: Player) {
    this.player = player;
  }

  waila() {
    const block = this.player.getBlockFromViewDirection({
      maxDistance: 8,
    })?.block;
    if (block) {
      this.player.onScreenDisplay.setActionBar(`Id: ${block.typeId}, Tags: ${block.getTags()}`);
    }
  }
  climb() {
    this.player.climb();
  }
}

export default PlayerUtils;
