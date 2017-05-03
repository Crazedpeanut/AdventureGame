const DRAWABLE_TYPE_TEXT = 'text';
const DRAWABLE_TYPE_SPRITE = 'sprite';
const DRAWABLE_TYPE_RECT = 'rect';

//TODO: Should split this up into subclasses
class Drawable {
    constructor(drawableType=DRAWABLE_TYPE_SPRITE, drawableData, layer=0) {
        this._drawableType = drawableType;
        this._drawableData = drawableData;
        this._layer = layer;
    }

    get layer() {
        return this._layer;
    }

    set layer(value) {
        this._layer = value;
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

module.exports = {
    Drawable,
    DRAWABLE_TYPE_TEXT,
    DRAWABLE_TYPE_SPRITE,
    DRAWABLE_TYPE_RECT
};