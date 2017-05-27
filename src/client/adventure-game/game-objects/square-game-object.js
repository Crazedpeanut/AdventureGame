import GameObject from '../../../../lib/game/game-object';
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';
import {Vector2} from '../../../../lib/math/vector';

const _ = require('lodash');

export default class SquareGameObject extends GameObject {

    constructor(id, name, game) {
        super(id, name, game);

        this.game = game;
    }

    init() {
        this.size = new Vector2(10, 10);
        this.localPosition = new Vector2(50, 50);
    }

    draw(position) {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
            position,
            width: this.size.x,
            height: this.size.y,
            fill: {
                color: '#00FF00'
            }
        }, 1));
    }
}