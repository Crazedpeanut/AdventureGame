const logger = require('../logger/logger');
import _ from 'lodash';
import DEFAULT_GAME_OBJECT_NAME from './game-object';
import { DRAWABLE_TYPE_RECT, DRAWABLE_TYPE_SPRITE, DRAWABLE_TYPE_TEXT } from '../../lib/game/drawable';
import { Vector2 } from '../../lib/math/vector';

const WARN_GAME_STATE_SIZE_THRESHOLD = 100;
const ONE_SECOND_MILLIS = 1000;
const GAME_FPS = 30;

const TIMER_MAX_LENGTH = 10;
const TICK_TIMER_NAME = 'tickTimer';
const DRAW_TIMER_NAME = 'drawTimer';

export default class Game {

    /**
     * @param {AbstractInput} input
     * @param {GraphicsInterface} graphics
     * @param {Assets} assetLoader
     * @param {number} gameWidth
     * @param {number} gameHeight
     * @param {EventBus} eventBus
     * @param {GameObjectTree} gameObjectTree
     */
    constructor(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree) {

        this.assetLoader = assetLoader;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.eventBus = eventBus;

        this._gameObjectTree = gameObjectTree;

        this._input = input;
        this._graphics = graphics;

        this._cameraPosition = new Vector2(0, 0);
        this._cameraSize = new Vector2(gameHeight, gameWidth);

        this.gameStartTimeMs = Date.now();
        this.timers = {
            [TICK_TIMER_NAME]: [],
            [DRAW_TIMER_NAME]: []
        };

        this._currentGameObjectIndexCounter = 100;
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

    _initGameObjects() {
        this._gameObjectTree.forEach(gameObject => {
            logger.debug(`Init Game Object ${gameObject.id} ${gameObject.name}`);
            gameObject.init();
        });
    }

    addGameObject(parentGameObject, gameObject) {
        if(!gameObject.id || gameObject.id < 0) {
            const nextIndex = this._currentGameObjectIndexCounter++;
            logger.info(`Adding new game object, using automatic increment.. ${nextIndex}`);

            gameObject.id = nextIndex;
        }

        if(gameObject.name === DEFAULT_GAME_OBJECT_NAME ) {
            logger.warning(`GameObject with id: ${gameObject.id} does not have a valid name or is using the default name`);
        }

        gameObject.init();
        this._gameObjectTree.addChildToGameObject(parentGameObject, gameObject);
    }

    //TODO: Improve this, it searches through the game object tree multiple times
    removeGameObject(gameObject) {
        const gameObjectToRemove = this._gameObjectTree.findGameObjectById(gameObject.id);


        if(!gameObjectToRemove) {
            logger.warning(`Game object with id: ${gameObject.id} does not exist`);
            return;
        }

        this._gameObjectTree.cascadeDeleteGameObject(gameObjectToRemove);
    }

    //TODO: Each Game Object is redrawn every frame, regardless of whether it has changed
    _buildFrame() {
        const gameObjectDrawPromises = [];

        this.drawTimeStart = Date.now();

        let currentGameObject = this._gameObjectTree.getRootGameObject();
        const gameObjectQueue = [currentGameObject];

        currentGameObject.calculatedGlobalPosition = currentGameObject.globalPosition;

        while(gameObjectQueue.length) {
            currentGameObject = gameObjectQueue.shift();

            const children = this._gameObjectTree.findGameObjectChildren(currentGameObject);

            children.forEach((child) => {
               child.calculatedGlobalPosition = this._calculateGameObjectGlobalPosition(currentGameObject.calculatedGlobalPosition, child);

               const screenPos = this._calculateGameObjectCameraPosition(this._cameraPosition, this._cameraSize, child.calculatedGlobalPosition, child.size);

               if(screenPos) {
                   gameObjectDrawPromises.push(child.draw(screenPos));
               }
            });

            gameObjectQueue.concat();
        }

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

    /**
     * @param {[Drawable]} drawables
     * @returns {Promise.<T>}
     * @private
     */
    _blitScene(drawables) {
        const newCanvas = this._graphics.newRenderingSurface(this.gameHeight, this.gameWidth);
        const ctx = newCanvas.getContext('2d');

        //TODO: Don't draw pixels that will be covered up by other game objects
        const filteredDrawables = _.filter(drawables, drawable => drawable); //Filter out undefined drawables
        const sortedDrawables = _.sortBy(filteredDrawables, drawable => drawable.layer);

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
                        Number(drawable.drawableData.position.x),
                        Number(drawable.drawableData.position.y),
                        Number(drawable.drawableData.width),
                        Number(drawable.drawableData.height)
                    );
                } break;

                case DRAWABLE_TYPE_TEXT: {

                    ctx.font = drawable.drawableData.font;

                    ctx.fillText(
                        drawable.drawableData.text,
                        Number(drawable.drawableData.position.x),
                        Number(drawable.drawableData.position.y)
                    );
                } break;

                case DRAWABLE_TYPE_SPRITE: {
                    ctx.drawImage(
                        drawable.drawableData.sprite,
                        Number(drawable.drawableData.position.x),
                        Number(drawable.drawableData.position.y),
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

        this._initGameObjects();

        setInterval(this._handleGameTick.bind(this), ONE_SECOND_MILLIS / GAME_FPS);
    }

    /**
     * @param {Vector2} parentGlobalPositionVector
     * @param {GameObject} gameObject
     * @private
     */
    _calculateGameObjectGlobalPosition(parentGlobalPositionVector, gameObject) {
        let globalPositionVector = gameObject.globalPosition;

        // If the gameObject already has a globalPosition set, use that.
        if(globalPositionVector) {
            return globalPositionVector;
        }

        const globalXPos = parentGlobalPositionVector.x + gameObject.localPosition.x;
        const globalYPos = parentGlobalPositionVector.y + gameObject.localPosition.y;
        return new Vector2(globalXPos, globalYPos);
    }

    /**
     * @param {Vector2} cameraGlobalPos
     * @param {Vector2} cameraSize
     * @param {Vector2} gameObjectGlobalPos
     * @param {Vector2} gameObjectSize
     * @description returns undefined if not in view
     * @returns {Vector2 | undefined}
     * @private
     */
    _calculateGameObjectCameraPosition(cameraGlobalPos, cameraSize, gameObjectGlobalPos, gameObjectSize) {
        if(!this._rectsInsersect(cameraGlobalPos, cameraSize, gameObjectGlobalPos, gameObjectSize)) {
            return undefined;
        }

        const screenXPos = gameObjectGlobalPos.x - cameraGlobalPos.x;
        const screenYPos = gameObjectGlobalPos.y - cameraGlobalPos.y;
        return new Vector2(screenXPos, screenYPos);
    }

    _rectsInsersect(r1Pos, r1Size, r2Pos, r2Size) {

        // Rect X 1 is past Rect X 2
        if(r1Pos.x > r2Pos.x)
            return false;

        // Rect Y 1 is past Rect Y 2
        if(r1Pos.y > r2Pos.y)
            return false;

        if(r1Pos.x + r1Size.x < r2Pos.x)
            return false;

        if(r1Pos.y + r1Size.y < r2Size.y)
            return false;

        return true;
    }

    _handleGameTick() {
        this.tickStartTimeMs = Date.now();

        this._updateObjects();
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

    get cameraPosition() {
        return this._cameraPosition;
    }

    set cameraPosition(value) {
        this._cameraPosition = value;
    }

    get cameraSize() {
        return this._cameraSize;
    }

    set cameraSize(value) {
        this._cameraSize = value;
    }
}
