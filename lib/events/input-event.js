import Event from './event';

const INPUT_EVENT_NAME = 'input_event';

class InputEvent extends Event {
    constructor(eventItems) {
        super(INPUT_EVENT_NAME);
        this._eventItems = eventItems;
    }

    get eventItems() {
        return this._eventItems;
    }

    set eventItems(value) {
        this._eventItems = value;
    }
}

InputEvent.prototype.INPUT_EVENT_NAME = INPUT_EVENT_NAME;

module.exports = InputEvent;