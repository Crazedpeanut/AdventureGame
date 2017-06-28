import InputEventItem from '../../events/input-event-item';
const logger = require('../../logger/logger');

function mapFromWebInput(webEvent) {
    switch(webEvent.type) {
        case 'keydown': {
            return new InputEventItem(InputEventItem.prototype.EVENT_TYPES.KEY_DOWN, webEvent.key);
        } break;

        case 'keyup': {
            return new InputEventItem(InputEventItem.prototype.EVENT_TYPES.KEY_UP, webEvent.key);
        } break;

        default: {
            logger.warning(`Can't map web event ${webEvent.type} to game input event`)
        }
    }
}

module.exports = {
    mapFromWebInput
};