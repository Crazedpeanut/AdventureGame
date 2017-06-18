const Vector2 = require('../../../lib/math/vector').Vector2;

const SECTOR_WIDTH = 100;
const SECTOR_HEIGHT = 100;

class Sector {
    constructor(coordinates, width, height) {
        this.coordinates = coordinates;
        this.width = width;
        this.height = height;
    }

    /**
     * @param {Vector2} coordinates
     */
    static createSectorFromCoordinates(coordinates) {
        const sectorX = Math.floor(coordinates.x / SECTOR_WIDTH);
        const sectorY = Math.floor(coordinates.y / SECTOR_HEIGHT);

        return new Sector(new Vector2(sectorX, sectorY), SECTOR_WIDTH, SECTOR_HEIGHT);
    }
}

module.exports = Sector;