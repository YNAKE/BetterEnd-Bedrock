class FoodUtils {
    constructor(itemStack, source) {
        this.itemStack = itemStack;
        this.source = source;
    }
    addEffect(effectName, seconds, amplifier, show) {
        this.source.addEffect(effectName, seconds * 20, { showParticles: show, amplifier });
    }
}
export default FoodUtils;
