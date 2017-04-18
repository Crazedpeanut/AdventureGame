import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import Drawable,{DRAWABLE_TYPE_SPRITE} from '../../../../lib/game/drawable';

const TEST_ASSET = 'static/img/Capture001.png';

class SceneGameObject extends GameObject {
    init() {
        //Preload asset cache with test asset
        return this._game.assetLoader.loadAsset(TEST_ASSET)
            .then(img => {
                return Promise.resolve(img);
            });
    }

    draw() {
        //Trust assetLoader will provide asset in timely manner
        //As long as it is has been given a chance to prefetch an asset
        return this._game.assetLoader.loadAsset(TEST_ASSET)
            .then(img => {
                const drawable = new Drawable(DRAWABLE_TYPE_SPRITE, {
                    x: 0,
                    y: 0,
                    width: this._game.gameWidth,
                    height: this._game.gameHeight,
                    image: img
                });
                return Promise.resolve(drawable);
            });
    }

    update() {
        //Always tell game engine no state changes occured
        return Promise.resolve(false);
    }
}

export default SceneGameObject;