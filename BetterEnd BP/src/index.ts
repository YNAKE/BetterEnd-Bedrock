import { world, system, Player } from "@minecraft/server";

// Biomes

import "./Biomes/biomeRegister";

// Utils

import "./Utils/External/ExternalUtils";

import PlayerUtils from "Utils/PlayerUtils";
import MobUtils from "Utils/MobUtils";

// index

system.runInterval(() => {
    const dimensions = [ "minecraft:nether", "minecraft:overworld", "minecraft:the_end" ];
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
                playerUtils.ambientStuff();
            }
            else {
                // Entity Utils
                const mobUtils = new MobUtils(entity);
                mobUtils.slimeSkin();
                mobUtils.hitbox();
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
    const player = world.getEntity(playerId) as Player;
    if (player.dimension.id === 'minecraft:the_end') {
        player.setDynamicProperty('betterend:in_the_end', true);
    }
});

system.afterEvents.scriptEventReceive.subscribe(e => {
    const { message, sourceEntity: player } = e;
    if (player) {
        console.warn(message);
        eval(message);
    }
});

world.beforeEvents.worldInitialize.subscribe(e => {
    e.blockComponentRegistry.registerCustomComponent('custom:stair', {
        onTick({ block }) {
            const { location, dimension: dim } = block;
            const loc = location;
            const entities = dim.getEntities({ maxDistance: 3, location, excludeTypes: [ "custom:hitbox" ] });
            const hitboxes = dim.getEntities({ type: "custom:hitbox", location, maxDistance: 0.6 });
            if (entities.length === 0) {
                world.setDynamicProperty(`stair:${loc.x} ${loc.y} ${loc.z}:${dim.id}`, false);
                return;
            }
            (entities[0] as Player).onScreenDisplay.setActionBar(JSON.stringify(entities[0].getEntitiesFromViewDirection().length));
            if (hitboxes.length === 0) {
                const hasEntity = world.getDynamicProperty(`stair:${loc.x} ${loc.y} ${loc.z}:${dim.id}`);
                if (hasEntity) return;
                world.setDynamicProperty(`stair:${loc.x} ${loc.y} ${loc.z}:${dim.id}`, true);
                dim.spawnEntity('custom:hitbox', { x: loc.x + 0.5, y: loc.y + 0.8, z: loc.z + 0.8 });
            }
        }
    });
});