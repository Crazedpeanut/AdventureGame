import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';
import {Vector2} from '../../../../lib/math/vector';

class SceneGameObject extends GameObject {
    init() {
        return Promise.resolve();
    }

    draw(position) {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
                position,
                width: this._game.gameWidth,
                height: this._game.gameHeight,
                fill: {
                    color: '#FF0000'
                }
            }, 0)
        );
    }

    update() {
        //Always tell game engine no state changes occured
        return Promise.resolve(false);
    }
}

export default SceneGameObject;