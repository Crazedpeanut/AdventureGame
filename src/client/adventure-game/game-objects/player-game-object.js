import GameObject from '../../../../lib/game/game-object';
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';

export default class PlayerGameObject extends GameObject {

    constructor(movementSpeed=5, id, name, game) {
        super(id, name, game);

        this.game = game;
        this.movementSpeed = movementSpeed;
    }

    init() {
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
    }

    draw() {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: {
                color: '#000000'
            }
        }, 1));
    }

    update() {
        const xAxis = this.game.input.getXAxis();
        const yAxis = this.game.input.getYAxis();

        const elapsedMillisSinceLastFrame = this.game.getElapsedMillisSinceLastFrame();

        //TODO: Fix this so movement isn't dodgy
        this.x += xAxis * this.movementSpeed;
        this.y += yAxis * this.movementSpeed;
    }
}