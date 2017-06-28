import InputInterface from './abstract-input';
const WebInputGameInputMap = require('./web-input-game-input-map');
const Rx = require('rxjs');
import InputEvent from '../../events/input-event';

const INPUT_DEBOUNCE_TIME_MS = 10;

class WebInput extends InputInterface {

    constructor(window, inputConfig, eventBus) {
        super(inputConfig, eventBus);
        this._window = window;
        this._inputSubject = new Rx.Subject();

        this._registerInputHandlers();
    }

    _handleAggregatedInputEvent(keyEventObservables) {
        const inputEventItems = keyEventObservables.map((keyEventObservable) => WebInputGameInputMap.mapFromWebInput(keyEventObservable.value));

        this.raiseInputEvent(new InputEvent(inputEventItems));
    }

    _handleKeyUpEvent(keyEvent) {
        this._inputSubject.next(Rx.Observable.of(keyEvent));
    }

    _handleKeyDownEvent(keyEvent) {
        this._inputSubject.next(Rx.Observable.of(keyEvent));
    }

    _registerInputHandlers() {
        this._window.addEventListener('keyup', this._handleKeyUpEvent.bind(this));
        this._window.addEventListener('keydown', this._handleKeyDownEvent.bind(this));

        this._inputSubject
            .buffer(this._inputSubject.debounceTime(INPUT_DEBOUNCE_TIME_MS))
            .subscribe({next: (keyEvents) => this._handleAggregatedInputEvent(keyEvents)});
    }

    _handleKeyEvent(event) {
        this.addInputEvent(event)
    }
}

module.exports = WebInput;