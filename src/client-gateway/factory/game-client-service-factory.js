const GameClientService = require('../service/game-client-service');

class GameClientServiceFactory {

    constructor(clientAdapter) {
        this.clientAdapter = clientAdapter;
    }

    create() {
        return new GameClientService(this.clientAdapter);
    }
}

module.exports = GameClientServiceFactory;