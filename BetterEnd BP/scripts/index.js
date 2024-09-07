import { world, system, Player } from "@minecraft/server";
import PlayerUtils from "Utils/PlayerUtils";
// Biomes
import "./Biomes/biomeRegister";
// index
system.runInterval(() => {
    const dimensions = ["minecraft:nether", "minecraft:overworld", "minecraft:the_end"];
    for (const dimension of dimensions) {
        const dim = world.getDimension(dimension);
        for (const entity of dim.getEntities()) {
            if (entity instanceof Player) {
                // Player Utils
                const playerUtils = new PlayerUtils(entity);
                playerUtils.waila();
            }
            else {
                // Entity Utils
            }
        }
    }
});
