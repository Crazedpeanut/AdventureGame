const _ = require('lodash');
const InputEventItem = require('../../events/input-event-item');
const {Vector2} = require('../../math/vector');

class PlayerProcessor {
    constructor(eventBus, game) {
        this.eventBus = eventBus;
        this.game = game;

        this._registerEventHandlers();
    }

    _registerEventHandlers() {

        //In a perfect world this would implement the EventHandler interface
        const PlayerInputEventHandler = {
            handleEvent: (event) => {
                const movementEventItems = this._movementEventItems(event);
                if(movementEventItems) {
                    this._handleMovement(movementEventItems);
                }
            }
        };

        this.game.eventBus.registerEventHandler(InputEvent.prototype.INPUT_EVENT_NAME, PlayerInputEventHandler)
    }

    _handleMovement(movementEventItems) {

        const xAxisMovementItem = _.find(movementEventItems, mEvntItm => mEvntItm.inputEventType === InputEventItem.prototype.EVENT_TYPES.X_AXIS);
        const yAxisMovementItem = _.find(movementEventItems, mEvntItm => mEvntItm.inputEventType === InputEventItem.prototype.EVENT_TYPES.Y_AXIS);

        if(xAxisMovementItem && yAxisMovementItem) {
            //TODO: This is not normalized and needs to be fixed
            this.localPosition = new Vector2(
                this.localPosition.x + xAxisMovementItem.inputEventValue * this.movementSpeed,
                this.localPosition.y + yAxisMovementItem.inputEventValue * this.movementSpeed
            );
        } else if(xAxisMovementItem) {
            this.localPosition = new Vector2(
                this.localPosition.x + xAxisMovementItem.inputEventValue * this.movementSpeed,
                this.localPosition.y
            );
        } else if(yAxisMovementItem) {
            this.localPosition = new Vector2(
                this.localPosition.x,
                this.localPosition.y + yAxisMovementItem.inputEventValue * this.movementSpeed,
            );
        }
    }

    _movementEventItems(event) {
        const movementEvents = [InputEventItem.prototype.EVENT_TYPES.X_AXIS, InputEventItem.prototype.EVENT_TYPES.Y_AXIS];

        return _.filter(event.eventItems, eventItem => {
            return (movementEvents.indexOf(eventItem.inputEventType) >= 0);
        })
    }
}

export default PlayerProcessor;