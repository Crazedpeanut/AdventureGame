import GameObject from '../../../../lib/game/game-object';
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';
import {Vector2} from '../../../../lib/math/vector';

export default class PlayerGameObject extends GameObject {

    constructor(id, name) {
        super(id, name);
    }

    init() {
        this.size = new Vector2(10, 10);
    }

    draw(position) {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
            position,
            width: this.size.x,
            height: this.size.y,
            fill: {
                color: '#000000'
            }
        }, 1));
    }
}