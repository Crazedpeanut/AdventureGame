import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';
import PlayerGameObject from './game-objects/player-game-object';
import DebugHudGameObject from './game-objects/debug-hud-game-object';

class AdventureGame extends Game {
    constructor(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree) {
        super(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree);

        const rootGameObject = gameObjectTree.getRootGameObject();
        this.addGameObject(rootGameObject, new SceneGameObject(undefined, 'SceneBase', this));
        this.addGameObject(rootGameObject, new PlayerGameObject(undefined, undefined, 'PlayerGameObject', this));
        this.addGameObject(rootGameObject, new DebugHudGameObject(undefined, 'Debug HUD', this))
    }
}

export default AdventureGame;