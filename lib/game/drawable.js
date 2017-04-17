const DRAWABLE_TYPE_TEXT = 'text';
const DRAWABLE_TYPE_SPRITE = 'sprite';

export default class Drawable {
    constructor(drawableType=DRAWABLE_TYPE_SPRITE, drawableData) {
        this._drawableType = drawableType;
        this._drawableData = drawableData;
    }


    get drawableType() {
        return this._drawableType;
    }

    set drawableType(value) {
        this._drawableType = value;
    }

    get drawableData() {
        return this._drawableData;
    }

    set drawableData(value) {
        this._drawableData = value;
    }
}

exports = {
    DRAWABLE_TYPE_TEXT,
    DRAWABLE_TYPE_SPRITE
};