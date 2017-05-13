const logger = require('../../lib/logger/logger');
import _ from 'lodash';
import DEFAULT_GAME_OBJECT_NAME from './game-object';
import { DRAWABLE_TYPE_RECT, DRAWABLE_TYPE_SPRITE, DRAWABLE_TYPE_TEXT } from '../../lib/game/drawable';
import InputEvent from './../../lib/events/input-event';

const WARN_GAME_STATE_SIZE_THRESHOLD = 100;
const ONE_SECOND_MILLIS = 1000;
const GAME_FPS = 30;

const TIMER_MAX_LENGTH = 10;
const TICK_TIMER_NAME = 'tickTimer';
const DRAW_TIMER_NAME = 'drawTimer';

export default class Game {
    constructor(input, graphics, assetLoader, gameWidth, gameHeight, eventBus) {

        this.assetLoader = assetLoader;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.eventBus = eventBus;

        //TODO make this a tree, not a list
        this._gameObjectTree = [];

        this._currentGameObjectId = 0;
        this._gameStateStack = [];

        this._input = input;
        this._graphics = graphics;

        // Add root game state to stack
        this._addCurrentStateToStack();

        this.gameStartTimeMs = Date.now();
        this.timers = {
            [TICK_TIMER_NAME]: [],
            [DRAW_TIMER_NAME]: []
        };
    }

    getAverageTickTimeMs() {
        return this._getAverageTimeFromTimer(TICK_TIMER_NAME);
    }

    getAverageDrawTimeMs() {
        return this._getAverageTimeFromTimer(DRAW_TIMER_NAME);
    }

    _addTimeToTimer(timerName, startTimeMs, endTimeMs) {
        const timerTimes = this.timers[timerName];

        if(!timerTimes) {
            logger.error(`Timer: ${timerName} does not exist`);
            return;
        }

        if(timerTimes.length >= TIMER_MAX_LENGTH) {
            timerTimes.shift();
        }

        timerTimes.push(endTimeMs - startTimeMs);
    }

    _getAverageTimeFromTimer(timerName) {
        const timerTimes = this.timers[timerName];

        if(timerTimes.length < 1) {
            return -1;
        }

        return timerTimes.reduce((acc, cur) => acc + cur) / timerTimes.length;
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

    //TODO: Improve this, it searchwes through the game object tree multiple times
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

    //TODO: Each Game Object is redrawn every frame, regardless of whether it has changed
    _buildFrame() {
        let gameObjectDrawPromises = [];

        this.drawTimeStart = Date.now();

        this._gameObjectTree.forEach(gameObject => {
            gameObjectDrawPromises.push(gameObject.draw());
        });

        return Promise.all(gameObjectDrawPromises);
    }

    _onGameObjectsDrawComplete(drawables) {
        this._blitScene(drawables)
            .then(this._onBlitSceneComplete.bind(this));
    }

    _onBlitSceneComplete(newCanvas) {
        this._graphics.drawScene(newCanvas);
        this.drawTimeEnd = Date.now();
        this._addTimeToTimer(DRAW_TIMER_NAME, this.drawTimeStart, this.drawTimeEnd);
    }

    _blitScene(drawables) {
        const newCanvas = this._graphics.newRenderingSurface(this.gameHeight, this.gameWidth);
        const ctx = newCanvas.getContext('2d');

        //TODO: Don't draw pixels that will be covered up by other game objects
        const sortedDrawables = _.sortBy(drawables, drawable => drawable.layer);

        sortedDrawables.forEach(drawable => {

            let ctxFill;

            if(drawable.drawableData.fill) {
                const fill = drawable.drawableData.fill;
                if(fill.color) {
                    ctxFill = fill.color;
                }
            }

            ctx.fillStyle = ctxFill;

            switch(drawable.drawableType) {
                case DRAWABLE_TYPE_RECT: {
                    ctx.fillRect(
                        Number(drawable.drawableData.x),
                        Number(drawable.drawableData.y),
                        Number(drawable.drawableData.width),
                        Number(drawable.drawableData.height)
                    );
                } break;

                case DRAWABLE_TYPE_TEXT: {

                    ctx.font = drawable.drawableData.font;

                    ctx.fillText(
                        drawable.drawableData.text,
                        Number(drawable.drawableData.x),
                        Number(drawable.drawableData.y),
                        Number(drawable.drawableData.maxWidth)
                    );
                } break;

                case DRAWABLE_TYPE_SPRITE: {
                    ctx.drawImage(
                        drawable.drawableData.sprite,
                        Number(drawable.drawableData.x),
                        Number(drawable.drawableData.y),
                        Number(drawable.drawableData.width),
                        Number(drawable.drawableData.height)
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
        this.tickStartTimeMs = Date.now();

        this._updateObjects();
        this._input.resetInputBuffer();
        this._buildFrame()
            .then(this._onGameObjectsDrawComplete.bind(this));

        this.tickEndTimeMs = Date.now();

        this._addTimeToTimer(TICK_TIMER_NAME, this.tickStartTimeMs, this.tickEndTimeMs);
    }

    _updateObjects() {
        this._gameObjectTree.forEach(gameObject => {
            gameObject.update();
        })
    }

    get input() {
        return this._input;
    }
}
