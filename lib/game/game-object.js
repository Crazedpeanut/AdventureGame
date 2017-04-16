const DEFAULT_GAME_OBJECT_NAME = 'undefined_game_object';

class GameObject {
    constructor(id=-1, name=DEFAULT_GAME_OBJECT_NAME, game) {
        this._id = id;
        this._name = name;
        this._game = game;
    }

    draw() {}

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

export {
    GameObject,
    DEFAULT_GAME_OBJECT_NAME
}