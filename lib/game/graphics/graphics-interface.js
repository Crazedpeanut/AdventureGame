class GraphicsInterface {

    newRenderingSurface() {
        throw new Error('Not implemented, you should subclass this');
    }

    drawScene(canvas) {
        throw new Error('Not implemented, you should subclass this');
    }

    createCanvas() {
        throw new Error('Not implemented, you should subclass this');
    }
}

module.exports = GraphicsInterface;