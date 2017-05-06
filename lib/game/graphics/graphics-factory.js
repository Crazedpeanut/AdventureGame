import WebCanvasGraphics from './web-canvas-graphics';

function webCanvasGraphics(document, rootCanvas){
    return new WebCanvasGraphics(document, rootCanvas);
}

module.exports = {
    webCanvasGraphics
};
