import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';

class AdventureGame extends Game {
    constructor(fetchInput, drawScene) {
        super(fetchInput, drawScene);

        this.initGameObjects();
    }

    initGameObjects() {
        this.addGameObject(new SceneGameObject(undefined, 'SceneBase', this));

        super.initGameObjects();
    }

    startGame() {
        super.startGame();
    }
}
