import { world, system } from '@minecraft/server';
// Define tick counters for each particle effect
const tickCounters = {
    white_oak_detect: 0,
    orange_tree_detect: 0
};
// Define particle effect names and their frequencies (in ticks)
const particleEffects = [
    { name: "betterend:white_oak_detect", frequency: 10 }, // Every 3 seconds (60 ticks)
    { name: "betterend:orange_tree_detect", frequency: 10 } // Every 3 seconds (60 ticks)
];
// Function to play particle effects
function playParticle(player, particleName) {
    player.runCommand(`particle ${particleName} ~~~`);
}
// Subscribe to the tick event
system.runInterval(() => {
    const players = world.getPlayers();
    for (const player of players) {
        particleEffects.forEach(effect => {
            const effectName = effect.name.split(':')[1];
            tickCounters[effectName]++;
            if (tickCounters[effectName] >= effect.frequency) {
                playParticle(player, effect.name);
                tickCounters[effectName] = 0; // Reset the counter
            }
        });
    }
}, 1); // Run the interval every tick
