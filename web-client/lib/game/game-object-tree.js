import GameObject from './game-object';
import Tree from '../collections/tree';
import {Vector2} from '../math/vector';
const logger = require('../logger/logger');
const _ = require('lodash');

class RootGameObject extends GameObject {

    constructor() {
        super(0, 'root');
    }

    init() {
        this.globalPosition = new Vector2(0, 0);
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

    cascadeDeleteGameObject(objectToDelete) {
        const foundNode = this._tree.bfSearchForSingleNode((currentGameObject) => currentGameObject.id === objectToDelete.id);

        if(foundNode) {
            this._tree.cascadeDeleteNodes(foundNode);
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

    addChildToGameObject(parentGameObject, gameObject) {
        const gameObjectParentNode = this._tree.bfSearchForSingleNode((currentGameObject) => {
            logger.debug(`parentGameObject id ${parentGameObject.id} currentGameObject id ${currentGameObject.id} Current node name: ${currentGameObject.name}`);
            return (parentGameObject.id === currentGameObject.id);
        });

        const gameObjectNode = new Tree(gameObject);

        if(!gameObjectParentNode) {
            logger.error(`Cannot find parent node from game object with id: ${parentGameObject.id} and name: ${parentGameObject.name}`);
            return;
        }

        gameObjectParentNode.addChildTree(gameObjectNode);
    }

    forEach(func) {
        let allNodes = this._tree.bfSearchForNodes(() => true);
        allNodes = _.map(allNodes, node => node.data);

        allNodes.forEach(func);
    }
}

module.exports = GameObjectTree;