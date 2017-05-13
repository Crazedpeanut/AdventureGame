class GraphicsInterface {

    newRenderingSurface(height, width) {
        throw new Error('Not implemented, you should subclass this');
    }

    drawScene(canvas) {
        throw new Error('Not implemented, you should subclass this');
    }
}

module.exports = GraphicsInterface;