const GameClientAdapter = require('../game-client-adapter');

class GameClientServiceFactory {

    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    create() {
        const clientAdapter = new GameClientAdapter();
        clientAdapter.sessionRepository = this.sessionRepository;
        return clientAdapter;
    }
}

module.exports = GameClientServiceFactory;