const _ = require('lodash');
const logger = require('../logger/logger');

module.exports = class Input {
    constructor(fetchInput, inputConfig) {
        this._fetchInput = fetchInput;
        this._inputSinceLastFetch = undefined;
        this.inputConfig = inputConfig;
    }

    fetchInput() {
        this._inputSinceLastFetch = this._fetchInput();
    }

    isKeyDown(key) {
        const keyDownEvent = _.find(this._inputSinceLastFetch, input => input.type === 'keydown' && input.key === key);

        return !!keyDownEvent;
    }

    getDigitalAxis(positiveKey, negativeKey) {
        const negativeDown = this.isKeyDown(negativeKey);
        const positiveDown = this.isKeyDown(positiveKey);

        if(negativeDown === positiveDown){
            return 0;
        }

        return positiveDown ? 1 : -1;
    }

    getDigitalXAxis() {
        return this.getDigitalAxis(
            this.inputConfig.xAxis.digital.positive,
            this.inputConfig.xAxis.digital.negative
        );
    }

    getDigitalYAxis() {
        return this.getDigitalAxis(
            this.inputConfig.yAxis.digital.positive,
            this.inputConfig.yAxis.digital.negative
        );
    }

    getXAxis() {
        return this.getDigitalXAxis();
    }

    getYAxis() {
        return this.getDigitalYAxis();
    }
};