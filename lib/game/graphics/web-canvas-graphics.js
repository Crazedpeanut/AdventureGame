const GraphicsInterface = require('./graphics-interface');

class WebCanvasGraphics extends GraphicsInterface {
    constructor(document, rootCanvas) {
        super();
        this._document = document;
        this._rootCanvas = rootCanvas;
    }

    newRenderingSurface(height, width) {
        const canvas = this._document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        return canvas;
    }

    drawScene(renderingSurface) {
        const ctx = this._rootCanvas.getContext('2d');
        ctx.drawImage(renderingSurface, 0, 0);
    }
}

module.exports = WebCanvasGraphics;