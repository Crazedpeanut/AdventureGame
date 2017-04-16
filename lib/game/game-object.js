const DEFAULT_GAME_OBJECT_NAME = 'undefined_game_object';

class GameObject {
    constructor(id=-1, name=DEFAULT_GAME_OBJECT_NAME, game) {
        this._id = id;
        this._name = name;
        this._game = game;
    }

    /**
     * Returns {Promise}
     */
    init() {}

    /**
     * Returns {Promise}
     */
    draw() {}

    /**
     * Returns {Promise} that will contain a boolean value, depending on if there is a state change that should
     * trigger a game stack to be added onto the game state stack
     */
    update() {}

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }
}

export default GameObject;
export {
    GameObject,
    DEFAULT_GAME_OBJECT_NAME
}