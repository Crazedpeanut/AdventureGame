const GameObject = require('./game-object');

const GAME_OBJECT_TYPE = 'player';

class PlayerGameObject extends GameObject {
    constructor(coordinates, gameObjectId) {
        super(GAME_OBJECT_TYPE, coordinates, gameObjectId);
    }
}