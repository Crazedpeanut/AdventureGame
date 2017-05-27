const DEFAULT_GAME_OBJECT_NAME = 'undefined_game_object';
import {Vector2} from '../math/vector';

class GameObject {
    constructor(id=-1, name=DEFAULT_GAME_OBJECT_NAME, game) {
        this._id = id;
        this._name = name;
        this._game = game;
        this._localPosition = new Vector2(0, 0);
        this._globalPosition = undefined;
        this._size = new Vector2(0, 0);
        this._localRotation = 0;
        this._calculatedGlobalPosition = undefined;
    }

    init() {}

    /**
     * Returns {Promise} Promise should resolve a Drawable.
     * @param {Vector2} position
     */
    draw(position) {}

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

    get localPosition() {
        return this._localPosition;
    }

    set localPosition(value) {
        this._localPosition = value;
    }

    get globalPosition() {
        return this._globalPosition;
    }

    set globalPosition(value) {
        this._globalPosition = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get localRotation() {
        return this._localRotation;
    }

    set localRotation(value) {
        this._localRotation = value;
    }

    get calculatedGlobalPosition() {
        return this._calculatedGlobalPosition;
    }

    set calculatedGlobalPosition(value) {
        this._calculatedGlobalPosition = value;
    }
}

export default GameObject;
export {
    GameObject,
    DEFAULT_GAME_OBJECT_NAME
}