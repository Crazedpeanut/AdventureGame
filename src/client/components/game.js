import React from 'react';
import AdventureGame from '../adventure-game/adventure-game';

const GAME_ID = 'game';
const GAME_WINDOW_DEFAULT_WIDTH = '400';
const GAME_WINDOW_DEFAULT_HEIGHT = '400';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            game: new AdventureGame(
                this._fetchInput.bind(this),
                this._drawScene.bind(this),
                this._createCanvas.bind(this),
                GAME_WINDOW_DEFAULT_WIDTH,
                GAME_WINDOW_DEFAULT_HEIGHT)
        };

        this._keyPressBuffer = [];
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

    _handleKeyDown() {
        console.log('keydown');
    }

    _handleKeyUp() {
        console.log('keyup');
    }

    _drawScene(newCanvas) {
        const ctx = this._gameCanvas.getContext('2d');
        ctx.drawImage(newCanvas, 0, 0);
    }

    _createCanvas() {
        return document.createElement('canvas');
    }

    _fetchInput() {

    }

    componentDidMount() {
        window.onload = () => {
            this._gameCanvas = document.getElementById(GAME_ID);
            this.state.game.startGame();

            window.addEventListener('keyup', this._handleKeyUp.bind(this));
            window.addEventListener('keydown', this._handleKeyDown.bind(this));
        };
    }
}

export default Game;
