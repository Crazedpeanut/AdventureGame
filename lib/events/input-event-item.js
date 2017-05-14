const EVENT_TYPES = {
    KEY_UP: 'KEY_UP',
    KEY_DOWN: 'KEY_DOWN',
    X_AXIS: 'X_AXIS',
    Y_AXIS: 'Y_AXIS'
};

class InputEventItem {
    constructor(eventItemType, eventItemValue) {
        this._inputEventType = eventItemType;
        this._inputEventValue = eventItemValue;
    }

    get inputEventType() {
        return this._inputEventType;
    }

    set inputEventType(value) {

        if(!EVENT_TYPES[value]) {
            throw new Error('Invalid Input Event Type: ' + value);
        }

        this._inputEventType = value;
    }

    get inputEventValue() {
        return this._inputEventValue;
    }

    set inputEventValue(value) {
        this._inputEventValue = value;
    }
}

InputEventItem.prototype.EVENT_TYPES = EVENT_TYPES;

module.exports = InputEventItem;