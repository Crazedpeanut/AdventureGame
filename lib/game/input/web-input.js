import InputInterface from './abstract-input';
import InputEventItem from '../../events/input-event-item';
const Rx = require('rxjs');

class WebInput extends InputInterface {

    constructor(window, inputConfig, eventBus) {
        super(inputConfig, eventBus);
        this._window = window;
        this._keyInputSubject = new Rx.Subject();

        this._registerInputHandlers();

       // this._inputSubject.buffer(this._inputSubject.debounce(() => 75)).subscribe({next: (x) => console.log('dwaqdwa', JSON.stringify(x))});
        this._keyInputSubject
            .buffer(this._keyInputSubject.debounceTime(75))
            .subscribe({next: (keyEvents) => this._handleAggregatedKeyInputEvent(keyEvents)});
    }

    _handleAggregatedKeyInputEvent(keyEvents) {
        const inputEventItems = [];

        keyEvents.forEach(keyEvent => {
            inputEventItems.push(new InputEventItem())
        });

        console.log('dwaqdwa', JSON.stringify(keyEvents))
    }

    _buildInputEventFromKeyEvent(keyEvent) {

    }

    _handleKeyUpEvent(keyEvent) {
        this._keyInputSubject.next(Rx.Observable.of(keyEvent));
    }

    _handleKeyDownEvent(keyEvent) {
        this._keyInputSubject.next(Rx.Observable.of(keyEvent));
    }

    _registerInputHandlers() {
        this._window.addEventListener('keyup', this._handleKeyUpEvent.bind(this));
        this._window.addEventListener('keydown', this._handleKeyDownEvent.bind(this));
    }

    _handleKeyEvent(event) {
        this.addInputEvent(event)
    }
}

module.exports = WebInput;