import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';
import PlayerGameObject from './game-objects/player-game-object';
import DebugHudGameObject from './game-objects/debug-hud-game-object';

class AdventureGame extends Game {
    constructor(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree) {
        super(input, graphics, assetLoader, gameWidth, gameHeight, eventBus, gameObjectTree);

        this.addGameObject(new SceneGameObject(undefined, 'SceneBase', this));
        this.addGameObject(new PlayerGameObject(undefined, undefined, 'PlayerGameObject', this));
        this.addGameObject(new DebugHudGameObject(undefined, 'Debug HUD', this))
    }
}

export default AdventureGame;