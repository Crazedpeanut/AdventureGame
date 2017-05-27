import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';
import PlayerGameObject from './game-objects/player-game-object';
import DebugHudGameObject from './game-objects/debug-hud-game-object';
import SquareGameObject from './game-objects/square-game-object';

class AdventureGame extends Game {
    constructor(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree) {
        super(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree);

        const rootGameObject = gameObjectTree.getRootGameObject();

        const playerGameObject = new PlayerGameObject(undefined, undefined, 'PlayerGameObject', this);
        const squareGameObject = new SquareGameObject(undefined, 'SquareGameObject', this);

        this.addGameObject(rootGameObject, playerGameObject);
        this.addGameObject(rootGameObject, new SceneGameObject(undefined, 'SceneBase', this));
        this.addGameObject(rootGameObject, new DebugHudGameObject(undefined, 'Debug HUD', this));

        this.addGameObject(playerGameObject, squareGameObject);
    }
}

export default AdventureGame;