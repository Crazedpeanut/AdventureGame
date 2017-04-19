import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';

class SceneGameObject extends GameObject {
    init() {
        return Promise.resolve();
    }

    draw() {
        //Trust assetLoader will provide asset in timely manner
        //As long as it is has been given a chance to prefetch an asset
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
                x: 0,
                y: 0,
                width: this._game.gameWidth,
                height: this._game.gameHeight,
                fill: {
                    color: '#FF0000'
                }
            })

        );
    }

    update() {
        //Always tell game engine no state changes occured
        return Promise.resolve(false);
    }
}

export default SceneGameObject;