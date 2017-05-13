module.exports = class Event {
    constructor(eventName) {
        this._eventName = eventName;
        this._eventTimestamp = Date.now();
    }

    get eventName() {
        return this._eventName;
    }

    set eventName(eventName) {
        this._eventName = eventName;
    }

    get eventTimestamp() {
        return this._eventTimestamp;
    }

    set eventTimestamp(value) {
        this._eventTimestamp = value;
    }
};