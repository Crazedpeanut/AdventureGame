import InputInterface from './input-interface';

class WebInput extends InputInterface {

    constructor(inputConfig, window) {
        super(inputConfig);
        this._document = document;
        this._inputBuffer = [];

        this._registerInputHandlers();
    }

    _registerInputHandlers() {
        window.addEventListener('keyup', this._handleKeyUp.bind(this));
        window.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    _handleKeyDown(event) {
        this._inputBuffer.push(event);
    }

    _handleKeyUp() {
        this._inputBuffer.push(event);
    }

    fetchInput() {
        const inputs = this._inputBuffer;
        this._inputBuffer = [];

        return inputs;
    }
}

module.exports = WebInput;