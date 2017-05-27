import GameObject from './game-object';
import Tree from '../collections/tree';
const _ = require('lodash');

class RootGameObject extends GameObject {

    constructor() {
        super(0, 'root');
    }

    init() {
        return Promise.resolve();
    }

    update() {
        return Promise.resolve(false);
    }

    draw(position) {
        return Promise.resolve();
    }
}

class GameObjectTree {
    constructor() {
        this._tree = new Tree(new RootGameObject());
    }

    getRootGameObject() {
        return this._tree.data;
    }

    findGameObjectById(id) {
        const foundNode = this._tree.bfSearchForSingleNode((currentGameObject) => id === currentGameObject.id);

        if(foundNode) {
            return foundNode.data;
        }
    }

    findGameObjectChildren(gameObject) {
        const foundNode = this._tree.bfSearchForSingleNode((currentGameObject) => gameObject.id === currentGameObject.id);

        if(foundNode) {
            return _.map(foundNode.children, childNode => childNode.data);
        }
    }

    findGameObjectParent(gameObject) {
        const foundNode = this._tree.bfSearchForSingleNode((currentGameObject) => gameObject.id === currentGameObject.id);

        if(foundNode) {
            return gameObject.parent;
        }
    }
}

module.exports = GameObjectTree;