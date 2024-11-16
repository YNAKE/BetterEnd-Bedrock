import { Entity, ItemStack } from "@minecraft/server";

class FoodUtils {
    private itemStack: ItemStack;
    private source?: Entity;
    constructor(itemStack: ItemStack, source?: Entity) {
        this.itemStack = itemStack;
        this.source = source;
    }

    addEffect(effectName: string, seconds: number, amplifier: number, show: boolean) {
        this.source.addEffect(effectName, seconds * 20, { showParticles: show, amplifier });
    }
}

export default FoodUtils;