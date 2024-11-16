import { Player } from "@minecraft/server";
Player.prototype.climb = function () {
    const block = this.dimension.getBlock(this.location);
    if (!block?.hasTag("betterend:can_climb"))
        return;
    this.isJumping && !this.isSneaking
        ? this.applyKnockback(0, 0, 0, 0.2)
        : this.applyKnockback(0, 0, 0, -0.06);
    if (this.isSneaking && !this.isJumping) {
        this.applyKnockback(0, 0, 0, 0.04);
    }
};
class PlayerUtils {
    constructor(player) {
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
    sky() {
        const nebula = 'animation.nebula.moving';
        this.player.playAnimation(nebula);
    }
    joinSky() {
        const player = this.player;
        const isInTheEnd = player.getDynamicProperty('betterend:in_the_end');
        if (isInTheEnd) {
            if (player.isSprinting || player.isJumping) {
                player.setDynamicProperty('betterend:in_the_end', false);
                this.sky();
            }
        }
    }
    fallVelocity() {
        const player = this.player;
        if (player.isFalling) {
            const vel = player.getVelocity().y;
            player.setDynamicProperty('betterend:fall_velocity', 0 + Math.abs(vel));
        }
    }
    climb() {
        this.player.climb();
    }
}
export default PlayerUtils;
