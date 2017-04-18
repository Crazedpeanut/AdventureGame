import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';
import PlayerGameObject from './game-objects/player-game-object';
import AssetLoader from '../../../lib/game/assets';

class AdventureGame extends Game {
    constructor(fetchInput, drawScene, createCanvas, gameWidth, gameHeight) {
        super(fetchInput, drawScene, new AssetLoader(), createCanvas, gameWidth, gameHeight);

        this.addGameObject(new SceneGameObject(undefined, 'SceneBase', this));
        this.addGameObject(new PlayerGameObject(undefined, 'PlayerGameObject', this));
    }
}

export default AdventureGame;