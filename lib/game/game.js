const logger = require('../../lib/logger/logger');
import _ from 'lodash';
import DEFAULT_GAME_OBJECT_NAME from './game-object';
import {DRAWABLE_TYPE_RECT, DRAWABLE_TYPE_SPRITE, DRAWABLE_TYPE_TEXT} from '../../lib/game/drawable';

const WARN_GAME_STATE_SIZE_THRESHOLD = 100;
const ONE_SECOND_MILLIS = 1000;
const GAME_FPS = 1;

export default class Game {
    constructor(fetchInput, drawScene, assetLoader, createCanvas, gameWidth, gameHeight) {

        this.assetLoader = assetLoader;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        //TODO make this a tree, not a list
        this._gameObjectTree = [];

        this._currentGameObjectId = 0;
        this._gameStateStack = [];

        this._createCanvas = createCanvas;
        this._fetchInput = fetchInput;
        this._drawScene = drawScene;

        // Add root game state to stack
        this._addCurrentStateToStack();
    }

    _addCurrentStateToStack() {
        const gameObjectTreeClone = _.cloneDeep(this._gameObjectTree);
        this._gameStateStack.push(({gameObjectTree: gameObjectTreeClone}));

        if(this._gameStateStack.length > WARN_GAME_STATE_SIZE_THRESHOLD) {
            logger.warn(`Game state stack has: ${this._gameStateStack.length} states. Need to share this with server and flush.`);
        }
    }

    _initGameObjects() {
        const gameObjectInitPromises = [];

        this._gameObjectTree.forEach(gameObject => {
            logger.debug(`Init Game Object ${gameObject.id} ${gameObject.name}`);
            gameObjectInitPromises.push(gameObject.init())
        });

        return Promise.all(gameObjectInitPromises)
            .then(initResults => {
                logger.debug('All Game Objects have been initialized');
                return Promise.resolve(initResults);
            })
            .catch(logger.error);
    }

    addGameObject(gameObject) {
        if(!gameObject.id || gameObject.id < 0) {
            logger.info(`Game object does not have a valid id, using automatic increment..`);
            gameObject.id = this._currentGameObjectId++;
        }

        if(gameObject.name === DEFAULT_GAME_OBJECT_NAME ) {
            logger.warning(`GameObject with id: ${gameObject.id} does not have a valid name or is using the default name`);
        }

        this._gameObjectTree.push(gameObject);
        this._addCurrentStateToStack();
    }

    //TODO: Improve this, it search through the game object tree multiple times
    removeGameObject(id) {
        const gameObjectToRemove = _.find(this._gameObjectTree, gameObject => gameObject.id === id);

        if(!gameObjectToRemove) {
            logger.warning(`Game object with id: ${id} does not exist`);
            return;
        }

        const gameObjectIndex = this._gameObjectTree.indexOf(gameObjectToRemove);
        this._gameObjectTree.splice(gameObjectIndex, 1);

        this._addCurrentStateToStack();
    }

    //TODO: Each Game Object is redrawn each frame, regardless of whether it has changed
    _buildFrame() {

        let gameObjectDrawPromises = [];
        this._gameObjectTree.forEach(gameObject => {
            gameObjectDrawPromises.push(gameObject.draw());
        });

        Promise.all(gameObjectDrawPromises)
            .then(this._onGameObjectsDrawComplete.bind(this));
    }

    _onGameObjectsDrawComplete(drawables) {
        this._blitScene(drawables)
            .then(this._onBlitSceneComplete.bind(this));
    }

    _onBlitSceneComplete(newCanvas) {
        this._drawScene(newCanvas);
    }

    _blitScene(drawables) {
        const newCanvas = this._createCanvas();
        const ctx = newCanvas.getContext('2d');

        //TODO: Don't draw pixels that will be covered up by other game objects
        const sortedDrawables = _.sortBy(drawables, drawable => drawable.layer);

        sortedDrawables.forEach(drawable => {
            switch(drawable.drawableType) {
                case DRAWABLE_TYPE_RECT: {
                    ctx.fillRect(
                        drawable.drawableData.x,
                        drawable.drawableData.y,
                        drawable.drawableData.width,
                        drawable.drawableData.height
                    );
                } break;

                case DRAWABLE_TYPE_TEXT: {
                    ctx.fillText(
                        drawable.text,
                        drawable.drawableData.x,
                        drawable.drawableData.y,
                        drawable.drawableData.maxWidth
                    );
                } break;

                case DRAWABLE_TYPE_SPRITE: {
                    ctx.drawImage(
                        drawable.drawable.sprite,
                        drawable.drawableData.x,
                        drawable.drawableData.y,
                        drawable.drawableData.width,
                        drawable.drawableData.height
                    );
                } break;

                default: {
                    logger.error('Unknown drawable type: ' + drawable.drawableType);
                } break;
            }
        });

        return Promise.resolve(newCanvas);
    }

    startGame() {
        logger.debug('Starting up game..');

        this._initGameObjects()
            .then(setInterval(this._handleGameTick.bind(this), ONE_SECOND_MILLIS / GAME_FPS));
    }

    _handleGameTick() {
        logger.debug('tick!');
        const inputSinceLastTick = this._fetchInput();
        this._updateObjects();
        this._buildFrame();
    }

    _updateObjects() {
        logger.debug('update game objects');
    }
}
