import GameObject from './game-object';

class SceneGameObject extends GameObject {
    constructor(assetLoader) {
        super();

        this.assetLoader = assetLoader;
    }

    draw() {
        return this.assetLoader.loadAsset('assets/Capture001.png');
    }
}

export default SceneGameObject;