import Input from '../input';
const DefaultConfig = require('../default-input-config.json');

module.exports = class InputBuilder {

    constructor() {
        this.inputClass = Input;
        this.config = DefaultConfig;

        return this;
    }

    setFetchInput(fetchInput) {
        this.fetchInput = fetchInput;

        return this;
    }

    setConfig(config) {
        this.config = config;
        
        return this;
    }

    setInputClass(inputClass) {
        this.inputClass = inputClass;

        return this;
    }

    build() {
        return new this.inputClass(this.fetchInput, this.config);
    }
};
