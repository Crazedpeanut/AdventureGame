const EventRouter = require('adventure-game-common/event-router/event-router.abstract');
const AuthSucceededEventHandler = require('../../event-handlers/engine/auth/auth-succeeded-event-handler');

class GameEngineRouteFactory {

    /**
     * @param {GameClientEngineAdapter} gameClientEngineAdapter
     * @param {GameClientService} gameClientService
     */
    constructor(gameClientEngineAdapter) {
        this.gameClientEngineAdapter = gameClientEngineAdapter;
    }

    /**
     * @return {AbstractEventRouter}
     */
    create() {
        const engineRouter = new EventRouter();
        const authRouter = new EventRouter();

        authRouter.registerHandler(/^authSucceeded/, new AuthSucceededEventHandler(this.gameClientEngineAdapter));

        engineRouter.registerRouter(/$authEvent\/.*^/, authRouter);

        return engineRouter;
    }
}

module.exports = GameEngineRouteFactory;
