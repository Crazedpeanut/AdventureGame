import Game from '../../../lib/game/game';
import SceneGameObject from './game-objects/scene-game-object';
import AssetLoader from '../../../lib/game/assets';

class AdventureGame extends Game {
    constructor(fetchInput, drawScene) {
        super(fetchInput, drawScene, new AssetLoader());
        this.addGameObject(new SceneGameObject(undefined, 'SceneBase', this));
    }
}

export default AdventureGame;