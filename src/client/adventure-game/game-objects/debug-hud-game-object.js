import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import {Drawable, DRAWABLE_TYPE_TEXT} from '../../../../lib/game/drawable';
import {Vector2} from '../../../../lib/math/vector';

class DebugHudGameObject extends GameObject {

    constructor(id, name, game) {
        super(id, name, game);

        this.game = game;
    }

    init() {
        this.message = ``;
        this.globalPosition = new Vector2(50,50);
        this.size = new Vector2(50, 50);

        return Promise.resolve();
    }

    draw(position) {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_TEXT, {
                position,
                text: this.message,
                fill: {
                    color: "#000000"
                },
                font: "15px helvetica"
            }, 1)
        );
    }

    update() {
        this.message = `Avg tick time: ${this.game.getAverageTickTimeMs()} Ave draw time: ${this.game.getAverageDrawTimeMs()} Events in EventBus: ${this.game.eventBus.eventBusItemCount()}`;
        return Promise.resolve(false);
    }
}

export default DebugHudGameObject;