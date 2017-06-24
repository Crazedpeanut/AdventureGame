const EventRouter = require('../../../common/event-router/event-router.abstract');

class ClientRouteFactory {

    /**
     * @param {GameClientEngineAdapter} gameClientEngineAdapter
     */
    constructor(gameClientEngineAdapter) {
        this._gameClientEngineAdapter = gameClientEngineAdapter;
    }

    create() {
        const clientRouter = new EventRouter();
        const authRouter = new EventRouter();

        clientRouter.registerRouter(/$authEvent\/.*^/, authRouter);

        return clientRouter;
    }
}

module.exports = ClientRouteFactory;