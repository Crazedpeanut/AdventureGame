const GraphicsInterface = require('./graphics-interface');

class WebCanvasGraphics extends GraphicsInterface {
    constructor(document, rootCanvas) {
        super();
        this._document = document;
        this._rootCanvas = rootCanvas;
    }

    newRenderingSurface() {
        return this._document.createElement('canvas');
    }

    drawScene(canvas) {
        const ctx = this._rootCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0);
    }

    createCanvas() {
        return this._createCanvas();
    }
}

module.exports = WebCanvasGraphics;