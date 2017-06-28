const _ = require('lodash');
import InputEventItem from '../../events/input-event-item';

module.exports = class AbstractInput {
    constructor(inputConfig, eventBus) {
        this._inputConfig = inputConfig;
        this._eventBus = eventBus;
    }

    isKeyDown(key, inputEventItems) {
        const keyDownEvent = _.find(inputEventItems, input => input.inputEventType === InputEventItem.prototype.EVENT_TYPES.KEY_DOWN && input.inputEventValue === key);

        return !!keyDownEvent;
    }

    raiseInputEvent(inputEvent) {
      //  this._inputBuffer.push(inputEvent);
        const xAxis = this.getDigitalXAxis(inputEvent.eventItems);
        const yAxis = this.getDigitalYAxis(inputEvent.eventItems);

        if(xAxis !== 0){
            inputEvent.eventItems.push(new InputEventItem(InputEventItem.prototype.EVENT_TYPES.X_AXIS, xAxis));
        }

        if(yAxis !== 0){
            inputEvent.eventItems.push(new InputEventItem(InputEventItem.prototype.EVENT_TYPES.Y_AXIS, yAxis));
        }

        this._eventBus.raiseEvent(inputEvent);
    }

    getDigitalAxis(positiveKey, negativeKey, inputEventItems) {
        const negativeDown = this.isKeyDown(negativeKey, inputEventItems);
        const positiveDown = this.isKeyDown(positiveKey, inputEventItems);

        if(negativeDown === positiveDown){
            return 0;
        }

        return positiveDown ? 1 : -1;
    }

    getDigitalXAxis(inputEventItems) {
        return this.getDigitalAxis(
            this._inputConfig.xAxis.digital.positive,
            this._inputConfig.xAxis.digital.negative,
            inputEventItems
        );
    }

    getDigitalYAxis(inputEventItems) {
        return this.getDigitalAxis(
            this._inputConfig.yAxis.digital.positive,
            this._inputConfig.yAxis.digital.negative,
            inputEventItems
        );
    }

    getXAxis() {
        return this.getDigitalXAxis();
    }

    getYAxis() {
        return this.getDigitalYAxis();
    }
};