import WebInput from './web-input';

function webInput(window, inputConfig) {
    return new WebInput(inputConfig, window);
}

module.exports = {
    webInput
};