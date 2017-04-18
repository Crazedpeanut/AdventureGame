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

        this.gameCanvas = null;
    }

    render(props={}) {
        return (
            <div id='gameCanvasContainer'>
                <canvas id={GAME_ID} width={props.width || GAME_WINDOW_DEFAULT_WIDTH} height={props.height ||GAME_WINDOW_DEFAULT_HEIGHT }>
                </canvas>
            </div>
        );
    }

    _drawScene(newCanvas) {
        const ctx = this.gameCanvas.getContext('2d');
        ctx.drawImage(newCanvas, 0, 0);
    }

    _createCanvas() {
        return document.createElement('canvas');
    }

    _fetchInput() {

    }

    componentDidMount() {
        window.onload = () => {
            this.gameCanvas = document.getElementById(GAME_ID);
            this.state.game.startGame();
        };
    }
}

export default Game;
