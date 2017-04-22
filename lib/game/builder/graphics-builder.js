import Graphics from '../graphics';

module.exports = class GraphicsBuilder {

    setDrawScene(drawScene) {
        this.drawScene = drawScene;

        return this;
    }

    setCreateCanvas(createCanvas) {
        this.createCanvas = createCanvas;

        return this;
    }

    build() {
        return new Graphics(this.drawScene, this.createCanvas);
    }

};