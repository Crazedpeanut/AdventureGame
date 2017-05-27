import GameObject from '../../../../lib/game/game-object';
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';
import InputEvent from '../../../../lib/events/input-event';
import InputEventItem from '../../../../lib/events/input-event-item';
import {Vector2} from '../../../../lib/math/vector';

const _ = require('lodash');

export default class PlayerGameObject extends GameObject {

    constructor(movementSpeed=5, id, name, game) {
        super(id, name, game);

        this.game = game;
        this.movementSpeed = movementSpeed;

        this._registerEventHandlers();
    }

    _movementEventItems(event) {
        const movementEvents = [InputEventItem.prototype.EVENT_TYPES.X_AXIS, InputEventItem.prototype.EVENT_TYPES.Y_AXIS];

        return _.filter(event.eventItems, eventItem => {
            return (movementEvents.indexOf(eventItem.inputEventType) >= 0);
        })
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

    init() {
        this.size = new Vector2(10, 10);
        return Promise.resolve();
    }

    draw(position) {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
            position,
            width: this.size.x,
            height: this.size.y,
            fill: {
                color: '#000000'
            }
        }, 1));
    }
}