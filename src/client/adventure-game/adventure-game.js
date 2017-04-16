import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';

class AdventureGame extends Game {
    constructor(fetchInput, drawScene) {
        super(fetchInput, drawScene);

        this._initGameObjects();
    }

    _initGameObjects() {
        this.addGameObject(new SceneGameObject(undefined, 'SceneBase', this));
    }

    startGame() {
        super.startGame();
    }
}
