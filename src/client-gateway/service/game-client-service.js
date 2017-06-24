class GameClientService {

    /**
     * @param {GameClientAdapter} gameClientAdapter
     */
    constructor(gameClientAdapter) {
        this._gameClientAdapter = gameClientAdapter;
    }

    /**
     * @param {String} socketId
     * @param {Event} event
     * @return Promise
     */
    async sendEvent(socketId, event) {
        return this._gameClientAdapter.sendEvent(socketId, event.getEventPath(), event);
    }
}

module.exports = GameClientService;