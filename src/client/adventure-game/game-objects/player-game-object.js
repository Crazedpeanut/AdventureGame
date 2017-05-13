import GameObject from '../../../../lib/game/game-object';
import {Drawable, DRAWABLE_TYPE_RECT} from '../../../../lib/game/drawable';
import InputEvent from '../../../../lib/events/input-event';
import InputEventItem from '../../../../lib/events/input-event-item';
import EventHandler from '../../../../lib/events/event-handler-interface';
const _ = require('lodash');

export default class PlayerGameObject extends GameObject {

    constructor(movementSpeed=5, id, name, game) {
        super(id, name, game);

        this.game = game;
        this.movementSpeed = movementSpeed;

        this._registerEventHandlers();
    }

    _movementEventItems(event) {
        const movementEvents = [InputEventItem.EVENT_TYPES.X_AXIS, InputEventItem.EVENT_TYPES.Y_AXIS];

        return _.filter(event.eventItems, eventItem => {
            return (movementEvents.indexOf(eventItem.inputEventType) > 0);
        })
    }

    _handleMovement(movementEventItems) {

        const xAxisMovementItem = _.find(movementEventItems, mEvntItm => mEvntItm.inputEventType === InputEventItem.EVENT_TYPES.X_AXIS);
        const yAxisMovementItem = _.find(movementEventItems, mEvntItm => mEvntItm.inputEventType === InputEventItem.EVENT_TYPES.Y_AXIS);

        if(xAxisMovementItem && yAxisMovementItem) {
            //TODO: This is not normalized and needs to be fixed
            this.x += xAxisMovementItem.inputItemValue * this.movementSpeed;
            this.y += yAxisMovementItem.inputItemValue * this.movementSpeed;
        } else if(xAxisMovementItem) {
            this.x += xAxisMovementItem.inputItemValue * this.movementSpeed;
        } else if(yAxisMovementItem) {
            this.y += yAxisMovementItem.inputItemValue * this.movementSpeed;
        }
    }

    _registerEventHandlers() {

        const PlayerInputEventHandler = class PlayerInputEventHandler extends EventHandler {
            handleEvent(event) {
                const movementEventItems = this._movementEventItems(event);
                if(movementEventItems) {
                    this._handleMovement(movementEventItems);
                }
            }
        };

        this.game.eventBus.registerEventHandler(InputEvent.INPUT_EVENT_NAME, new PlayerInputEventHandler())
    }

    init() {
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
    }

    draw() {
        return Promise.resolve(new Drawable(DRAWABLE_TYPE_RECT, {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: {
                color: '#000000'
            }
        }, 1));
    }
}