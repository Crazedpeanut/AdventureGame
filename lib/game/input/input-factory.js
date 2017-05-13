import WebInput from './web-input';
const defaultInputConfig = require('./default-input-config');

function webInput(window, inputConfig, eventBus) {

    if(!inputConfig) {
        inputConfig = defaultInputConfig;
    }

    return new WebInput(window, inputConfig, eventBus);
}

module.exports = {
    webInput
};