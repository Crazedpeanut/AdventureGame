import React from 'react';
import GameBuilder from '../../../lib/game/builder/game-builder';
import AdventureGame from '../adventure-game/adventure-game';
import InputBuilder from '../../../lib/game/builder/input-builder';
import AssetLoader from '../../../lib/game/assets';
import GraphicsBuilder from '../../../lib/game/builder/graphics-builder';

const GAME_ID = 'game';
const GAME_WINDOW_DEFAULT_WIDTH = '400';
const GAME_WINDOW_DEFAULT_HEIGHT = '400';

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
            <div id='gameCanvasContainer'>
                <canvas id={GAME_ID} width={props.width || GAME_WINDOW_DEFAULT_WIDTH} height={props.height ||GAME_WINDOW_DEFAULT_HEIGHT }>
                </canvas>
            </div>
        );
    }

    _handleKeyDown(event) {
        this._inputBuffer.push(event);
    }

    _handleKeyUp() {
        this._inputBuffer.push(event);
    }

    _drawScene(newCanvas) {
        const ctx = this._gameCanvas.getContext('2d');
        ctx.drawImage(newCanvas, 0, 0);
    }

    _createCanvas() {
        return document.createElement('canvas');
    }

    _fetchInput() {
        const inputs = this._inputBuffer;
        this._inputBuffer = [];

        return inputs;
    }

    componentDidMount() {

        window.onload = () => {

            const graphics = new GraphicsBuilder()
                .setDrawScene(this._drawScene.bind(this))
                .setCreateCanvas(this._createCanvas.bind(this))
                .build();

            const input = new InputBuilder()
                .setFetchInput(this._fetchInput.bind(this))
                .build();

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

            window.addEventListener('keyup', this._handleKeyUp.bind(this));
            window.addEventListener('keydown', this._handleKeyDown.bind(this));
        };
    }
}

export default Game;
