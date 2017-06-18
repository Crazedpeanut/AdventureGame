const EventRouter = require('../../../common/event-router/event-router.abstract');
const AuthSucceededEventHandler = require('../../event-handlers/engine/auth/auth-succeeded-event-handler');

class GameEngineRouteFactory {

    /**
     * @param {GameEngineService} gameEngineService
     * @param {GameClientService} gameClientService
     */
    constructor(gameEngineService, gameClientService) {
        this.gameEngineService = gameEngineService;
        this.gameClientService = gameClientService;
    }

    create() {
        const clientRouter = new EventRouter();
        const authRouter = new EventRouter();

        authRouter.registerHandler(/^authSucceeded/, new AuthSucceededEventHandler(this.gameEngineService, this.gameClientService));

        clientRouter.registerRouter(/$authEvent\/.*^/, authRouter);
    }
}

module.exports = GameEngineRouteFactory;