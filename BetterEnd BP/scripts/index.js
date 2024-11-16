import { world, system, Player } from "@minecraft/server";
import PlayerUtils from "Utils/PlayerUtils";
// Biomes
import "./Biomes/biomeRegister";
// Utils
import "./Utils/External/ExternalUtils";
// index
system.runInterval(() => {
    const dimensions = ["minecraft:nether", "minecraft:overworld", "minecraft:the_end"];
    for (const dimension of dimensions) {
        const dim = world.getDimension(dimension);
        for (const entity of dim.getEntities()) {
            if (entity instanceof Player) {
                // Player Utils
                const playerUtils = new PlayerUtils(entity);
                // playerUtils.waila();
                playerUtils.climb();
                playerUtils.joinSky();
                playerUtils.fallVelocity();
            }
            else {
                // Entity Utils
            }
        }
    }
});
// Sky
world.afterEvents.playerDimensionChange.subscribe(e => {
    const { player, toDimension } = e;
    if (toDimension.id === 'minecraft:the_end') {
        new PlayerUtils(player).sky();
    }
});
world.afterEvents.playerJoin.subscribe(e => {
    const { playerId } = e;
    const player = world.getEntity(playerId);
    if (player.dimension.id === 'minecraft:the_end') {
        player.setDynamicProperty('betterend:in_the_end', true);
    }
});
