import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';
import {Vector2} from '../../../../lib/math/vector';

class SceneGameObject extends GameObject {
    init() {
        this.size = new Vector2(this._game.gameWidth, this._game.gameHeight);
    }

    draw(position) {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
                position,
                width: this.size.x,
                height: this.size.y,
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