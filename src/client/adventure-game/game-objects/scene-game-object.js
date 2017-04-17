import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import Drawable,{DRAWABLE_TYPE_SPRITE} from '../../../../lib/game/drawable';

const TEST_ASSET = 'static/img/Capture001.png';

class SceneGameObject extends GameObject {
    constructor(id=-1, name, game) {
        super(id, name, game);

        this._game = game;
    }

    init() {
        //Preload asset cache with test asset
        return this._game.assetLoader.loadAsset(TEST_ASSET)
            .then(img => {
                logger.info('Test Asset Complete');
                logger.info(`Type of response: ${typeof img}`);
                return Promise.resolve(img);
            });
    }

    draw() {
        //Trust assetLoader will provide asset in timely manner
        //As long as it is has been given a chance to prefetch an asset
        return this._game.assetLoader.loadAsset(TEST_ASSET)
            .then(img => {
                const drawable = new Drawable(DRAWABLE_TYPE_SPRITE, img);
                return Promise.resolve(drawable);
            });
    }

    update() {
        //Always tell game engine no state changes occured
        return Promise.resolve(false);
    }
}

export default SceneGameObject;