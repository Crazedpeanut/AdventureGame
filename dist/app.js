"use strict";

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(React.createElement(
    "html",
    null,
    React.createElement(
        "head",
        null,
        React.createElement("script", { src: "./dist/bundle.js" })
    ),
    React.createElement(
        "body",
        null,
        "Hello World!"
    )
));