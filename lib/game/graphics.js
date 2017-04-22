module.exports = class Graphics {
    constructor(drawScene, createCanvas) {
        this._drawScene = drawScene;
        this._createCanvas = createCanvas;
    }

    drawScene(canvas) {
        return this._drawScene(canvas);
    }

    createCanvas() {
        return this._createCanvas();
    }
};