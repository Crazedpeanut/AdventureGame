module.exports = class GameBuilder {
    setInput(input) {
        this.input = input;

        return this;
    }

    setGraphics(graphics) {
        this.graphics = graphics;

        return this;
    }

    setGameWidth(gameWidth) {
        this.gameWidth = gameWidth;

        return this;
    }

    setGameHeight(gameHeight) {
        this.gameHeight = gameHeight;

        return this;
    }

    setAssetLoader(assetLoader) {
        this.assetLoader = assetLoader;

        return this;
    }

    setGameClass(gameClass) {
        this.gameClass = gameClass;

        return this;
    }

    build() {
        return new this.gameClass(this.input, this.graphics, this.assetLoader, this.gameWidth, this.gameHeight);
    }
};
