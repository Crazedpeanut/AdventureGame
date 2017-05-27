import React from 'react';
import AdventureGame from '../adventure-game/adventure-game';
import AssetLoader from '../../../lib/game/assets';
import CreateObjectFormComponent from './create-object-form-component';
import GraphicsFactory from '../../../lib/game/graphics/graphics-factory';
import GameBuilder from '../../../lib/game/builder/game-builder';
import InputFactory from '../../../lib/game/input/input-factory';
import EventBus from '../../../lib/events/event-bus';
import GameObjectTree from '../../../lib/game/game-object-tree';

const GAME_CONTAINER_ID_ATTR = 'gameContainer';
const GAME_CANVAS_ID_ATTR = 'game';
const GAME_WINDOW_DEFAULT_WIDTH = 800;
const GAME_WINDOW_DEFAULT_HEIGHT = 800;

class Game extends React.Component {
    constructor() {
        super();

        this.state = {
            game: undefined
        };

        this._inputBuffer = [];
    }

    render(props={}) {
        return (
            <div id={GAME_CONTAINER_ID_ATTR}>
                <canvas id={GAME_CANVAS_ID_ATTR} width={props.width || GAME_WINDOW_DEFAULT_WIDTH} height={props.height ||GAME_WINDOW_DEFAULT_HEIGHT }>
                </canvas>
                <CreateObjectFormComponent onSubmit={this._handleCreateObjectFormSubmit}/>
            </div>
        );
    }

    _handleCreateObjectFormSubmit(evnt) {
        console.log(JSON.stringify(evnt));
    }

    componentDidMount() {

        window.onload = () => {

            const gameCanvas = document.getElementById(GAME_CANVAS_ID_ATTR);
            const eventBus = new EventBus();
            const graphics = GraphicsFactory.webCanvasGraphics(document, gameCanvas);
            const input = InputFactory.webInput(window, undefined, eventBus);
            const gameObjectTree = new GameObjectTree();

            this.state.game = new GameBuilder()
                .setGameClass(AdventureGame)
                .setInput(input)
                .setGraphics(graphics)
                .setGameHeight(GAME_WINDOW_DEFAULT_HEIGHT)
                .setGameWidth(GAME_WINDOW_DEFAULT_WIDTH)
                .setAssetLoader(new AssetLoader())
                .setEventBus(eventBus)
                .setGameObjectTree(gameObjectTree)
                .build();

            this.state.game.startGame();
        };
    }
}

export default Game;
