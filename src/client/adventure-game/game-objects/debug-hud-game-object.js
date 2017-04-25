import GameObject from '../../../../lib/game/game-object';
const logger = require('../../../../lib/logger/logger');
import {Drawable, DRAWABLE_TYPE_TEXT} from '../../../../lib/game/drawable';

class DebugHudGameObject extends GameObject {
    init() {
        return Promise.resolve();
    }

    draw() {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_TEXT, {
                x: 0,
                y: 0,
                maxWidth: '50px',
                text: "Blah blash blah",
                fill: {
                    color: "#000000"
                },
                font: "30px georgia"
            }, 1)
        );
    }

    update() {
        //Always tell game engine no state changes occured
        return Promise.resolve(false);
    }
}

export default DebugHudGameObject;