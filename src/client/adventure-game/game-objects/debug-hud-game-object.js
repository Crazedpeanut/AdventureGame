import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import {Drawable, DRAWABLE_TYPE_TEXT} from '../../../../lib/game/drawable';

class DebugHudGameObject extends GameObject {

    constructor(id, name, game) {
        super(id, name, game);

        this.game = game;
    }

    init() {
        this.message = ``;

        return Promise.resolve();
    }

    draw() {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_TEXT, {
                x: 20,
                y: 20,
                text: this.message,
                fill: {
                    color: "#000000"
                },
                font: "30px helvetica"
            }, 1)
        );
    }

    update() {
        //Always tell game engine no state changes occured
        this.message = `Avg tick time: ${this.game.getAverageTickTimeMs()} Ave draw time: ${this.game.getAverageDrawTimeMs()}`;
        return Promise.resolve(false);
    }
}

export default DebugHudGameObject;