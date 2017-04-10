import React from 'react';
import SceneGameObject from '../game/game_objects/scene-game-object';
import Assets from '../game/assets';

const GAME_ID = 'game';
const GAME_WINDOW_DEFAULT_WIDTH = '400';
const GAME_WINDOW_DEFAULT_HEIGHT = '400';
const GAME_FPS = 30;
const ONE_SECOND_MILLIS = 1000;

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            gameCanvas: null,
            gameObjects: [new SceneGameObject(new Assets())]
        }
    }

    render(props={}) {
        return (
            <canvas id={GAME_ID} width={props.width || GAME_WINDOW_DEFAULT_WIDTH} height={props.height ||GAME_WINDOW_DEFAULT_HEIGHT }>
            </canvas>
        );
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

    startGame() {
       // setInterval(this.handleGameTick.bind(this), ONE_SECOND_MILLIS / GAME_FPS);

        this.handleGameTick();
    }

    handleGameTick() {
        console.log('tick!');
        this.handleInput();
        this.updateObjects();
        this.drawScene();
    }

    handleInput() {

    }

    updateObjects() {

    }

    drawScene() {
        const canvasContext = this.state.gameCanvas.getContext('2d');

        this.state.gameObjects.forEach(gameObject => gameObject.draw());
        canvasContext.beginPath();
        canvasContext.rect(20, 40, 50, 50);
        canvasContext.fillStyle = "#FF0000";
        canvasContext.fill();
        canvasContext.closePath();
    }
}

export default Game;
