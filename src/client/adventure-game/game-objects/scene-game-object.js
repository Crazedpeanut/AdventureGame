import GameObject from '../../../../lib/game/game-object';

class SceneGameObject extends GameObject {
    constructor(id=-1, name, game) {
        super(id, name, game);
    }

    init() {
        return this.game.assetLoader.loadAsset('static/img/Capture001.png')
            .then((img) => this.assets.idle = img);
    }

    draw() {
        return new Promise((resolve, reject) => {
            resolve(this.assets.idle);
        });
    }

    update() {
        //Always tell game engine no state changes occured
        return Promise.resolve(false);
    }
}

export default SceneGameObject;