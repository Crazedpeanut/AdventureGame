import winston from 'winston';
import _ from 'lodash';
import DEFAULT_GAME_OBJECT_NAME from './game-object';

const WARN_GAME_STATE_SIZE_THRESHOLD = 100;

export default class Game {
    constructor(fetchInput, drawScene, assetLoader) {
        this.fetchInput = fetchInput;
        this.drawScene = drawScene;
        this.assetLoader = assetLoader;

        //TODO make this a tree, not a list
        this._gameObjectTree = [];
        this._currentGameObjectId = 0;
        this._gameStateStack = [];

        // Add root game state to stack
        this._addCurrentStateToStack();
    }

    _addCurrentStateToStack() {
        const gameObjectTreeClone = _.cloneDeep(this._gameObjectTree);
        this._gameStateStack({gameObjectTree: gameObjectTreeClone});

        if(this._gameStateStack.length > WARN_GAME_STATE_SIZE_THRESHOLD) {
            winston.warn(`Game state stack has: ${this._gameStateStack.length} states. Need to share this with server and flush.`);
        }
    }

    addGameObject(gameObject) {
        if(!gameObject.id || gameObject.id < 0) {
            winston.info(`Game object does not have a valid id, using automatic increment..`);
            gameObject.id = this._currentGameObjectId++;
        }

        if(gameObject.name === DEFAULT_GAME_OBJECT_NAME ) {
            winston.warning(`GameObject with id: ${gameObject.id} does not have a valid name or is using the default name`);
        }

        this._gameObjectTree.push(gameObject);
        this._addCurrentStateToStack();
    }

    //TODO: Improve this, it search through the game object tree multiple times
    removeGameObject(id) {
        const gameObjectToRemove = _.find(this._gameObjectTree, gameObject => gameObject.id === id);

        if(!gameObjectToRemove) {
            winston.warning(`Game object with id: ${id} does not exist`);
            return;
        }

        const gameObjectIndex = this._gameObjectTree.indexOf(gameObjectToRemove);
        this._gameObjectTree.splice(gameObjectIndex, 1);

        this._addCurrentStateToStack();
    }

    _buildSceneFrame() {
        const canvasContext = this.state.gameCanvas.getContext('2d');

        let gameObjectDrawPromises = [];
        this._gameObjectTree.forEach(gameObject => {
            gameObjectDrawPromises.push(gameObject.draw());
        });

        Promise.all(gameObjectDrawPromises)
            .then(this._onGameObjectsDrawComplete.bind(this));
    }

    _onGameObjectsDrawComplete(gameObjectBitmaps) {
        this._blitScene(gameObjectBitmaps)
            .then(this._onBlitSceneComplete.bind(this));
    }

    _onBlitSceneComplete(sceneBitmap) {

    }

    _blitScene(gameObjectBitMaps) {
        //TODO: Render other bitmaps
        return Promise.resolve(gameObjectBitMaps[0]);
    }

    startGame() {
        // setInterval(this._handleGameTick.bind(this), ONE_SECOND_MILLIS / GAME_FPS);

        this._handleGameTick();
    }

    _handleGameTick() {
        console.log('tick!');
        const inputSinceLastTick = this.fetchInput();
        this._updateObjects();
        this._buildSceneFrame();
    }

    _updateObjects() {

    }
}
