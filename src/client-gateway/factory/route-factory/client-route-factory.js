const EventRouter = require('../../../common/event-router/event-router.abstract');
const AuthRequiredEventHandler = require('../../event-handlers/client/auth/auth-required-event-handler');

class ClientRouteFactory {

    /**
     * @param {GameClientService} gameClient
     */
    static create(gameClient) {
        const clientRouter = new EventRouter();
        const authRouter = new EventRouter();

        authRouter.registerHandler(/^authRequired$/, new AuthRequiredEventHandler(gameClient));

        clientRouter.registerRouter(/$authEvent\/.*^/, authRouter);
    }
}

module.exports = ClientRouteFactory;