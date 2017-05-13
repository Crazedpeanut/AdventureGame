import Event from './event';
const _ = require('lodash');

const EVENT_STORE_POLL_FREQ_MS = 5;

module.exports = class EventBus {
    constructor() {
        this._eventStore = [];
        this._registeredEventHandlers = {};
        this._eventHistory = [];

        setTimeout(this._checkEventStore.bind(this), EVENT_STORE_POLL_FREQ_MS);
    }

    registerEventHandler(eventName, eventHandler) {
        if(!this._registeredEventHandlers[eventName]){
            this._registeredEventHandlers[eventName] = [];
        }

        this._registeredEventHandlers[eventName].push(eventHandler);
    }

    /**
     * @param {Event} event
     */
    raiseEvent(event) {
        this._eventStore.push(event);
    }

    _checkEventStore() {
        this._eventStore.forEach(event => {
            this._notifyEventHandlers(event);
        });

        this._eventStore = [];
    }

    /**
     * @param {Event} event
     * @private
     */
    _notifyEventHandlers(event) {
        const eventHandlers = this._registeredEventHandlers[event.eventName];

        if(!eventHandlers)
            return;

        eventHandlers.forEach(eventHandler => {
            eventHandler.handleEvent(Object.assign(event));
        })
    }

};