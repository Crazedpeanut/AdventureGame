import React from 'react';
import AdventureGame from '../adventure-game/adventure-game';

const GAME_ID = 'game';
const GAME_WINDOW_DEFAULT_WIDTH = '400';
const GAME_WINDOW_DEFAULT_HEIGHT = '400';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            game: new AdventureGame(this.fetchInput, this.drawScene)
        };

        this.gameCanvas = null;
    }

    render(props={}) {
        return (
            <canvas id={GAME_ID} width={props.width || GAME_WINDOW_DEFAULT_WIDTH} height={props.height ||GAME_WINDOW_DEFAULT_HEIGHT }>
            </canvas>
        );
    }

    drawScene(newFrameBitmap) {
        this.gameCanvas.drawImage(newFrameBitmap, 0, 0);
    }

    fetchInput() {

    }

    componentDidMount() {

        const gameCanvas = document.getElementById(GAME_ID);

        this.setState({
            gameCanvas: gameCanvas
        });

        window.onload = () => {
            this.startGame();
        };
    }
}

export default Game;
