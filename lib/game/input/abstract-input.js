const _ = require('lodash');

module.exports = class AbstractInput {
    constructor(inputConfig, eventBus) {
        this._inputConfig = inputConfig;
        this._eventBus = eventBus;
    }

    isKeyDown(key) {
        const keyDownEvent = _.find(this._inputBuffer, input => input.type === 'keydown' && input.key === key);

        return !!keyDownEvent;
    }

    raiseInputEvent(inputEvent) {
        /*this._inputBuffer.push(inputEvent);*/

    }

    resetInputBuffer() {
        this._inputBuffer = [];
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
            this._inputConfig.xAxis.digital.positive,
            this._inputConfig.xAxis.digital.negative
        );
    }

    getDigitalYAxis() {
        return this.getDigitalAxis(
            this._inputConfig.yAxis.digital.positive,
            this._inputConfig.yAxis.digital.negative
        );
    }

    getXAxis() {
        return this.getDigitalXAxis();
    }

    getYAxis() {
        return this.getDigitalYAxis();
    }
};