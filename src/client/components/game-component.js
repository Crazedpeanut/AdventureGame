import React from 'react';
import AdventureGame from '../adventure-game/adventure-game';
import AssetLoader from '../../../lib/game/assets';
import CreateObjectFormComponent from './create-object-form-component';
import GraphicsFactory from '../../../lib/game/graphics/graphics-factory';
import GameBuilder from '../../../lib/game/builder/game-builder';
import InputFactory from '../../../lib/game/input/input-factory';

const GAME_ID = 'game';
const GAME_WINDOW_DEFAULT_WIDTH = 800;
const GAME_WINDOW_DEFAULT_HEIGHT = 800;

class Game extends React.Component {
    constructor() {
        super();

        this.state = {
            game: undefined
        };

        this._inputBuffer = [];
        this._gameCanvas = null;
    }

    render(props={}) {
        return (
            <div id='gameContainer'>
                <canvas id={GAME_ID} width={props.width || GAME_WINDOW_DEFAULT_WIDTH} height={props.height ||GAME_WINDOW_DEFAULT_HEIGHT }>
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

            const graphics = GraphicsFactory.webCanvasGraphics(document);

            const input = InputFactory.webInput(window, )

            this.state.game = new GameBuilder()
                .setGameClass(AdventureGame)
                .setInput(input)
                .setGraphics(graphics)
                .setGameHeight(GAME_WINDOW_DEFAULT_HEIGHT)
                .setGameWidth(GAME_WINDOW_DEFAULT_WIDTH)
                .setAssetLoader(new AssetLoader())
                .build();

            this._gameCanvas = document.getElementById(GAME_ID);
            this.state.game.startGame();
        };
    }
}

export default Game;
