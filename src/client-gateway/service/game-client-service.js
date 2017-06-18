const AuthRequiredEvent = require('../../common/events/auth-required-event');

class GameClientService {

    /**
     * @param {SessionRepository} sessionRepository
     * @param {SocketResolverService} socketResolverService
     * @param {GameClientAdapter} gameClientAdapter
     */
    constructor(sessionRepository, socketResolverService, gameClientAdapter) {
        this._sessionRepository = sessionRepository;
        this._socketResolverService = socketResolverService;
        this._gameClientAdapter = gameClientAdapter;
    }

    /**
     * @param {String} sessionId
     * @param {AuthSucceededEvent} authSucceededEvent
     * @return Promise
     */
    async sendAuthenticationSuccessEvent(sessionId, authSucceededEvent) {
        const socket = this._socketResolverService.resolveSocket(sessionId);

        if(!socket) throw new Error(`Socket associated with sessionId: ${sessionId} does not exist on this node`);

        socket.emit('/authEvent/authSucceeded', authSucceededEvent);
    }

    /**
     * @param {String} sessionId
     */
    sendAuthenticationRequiredEvent(sessionId) {
        const socket = this._socketResolverService.resolveSocket(sessionId);

        if(!socket) throw new Error(`Socket associated with sessionId: ${sessionId} does not exist on this node`);

        socket.emit('/authEvent/authRequired', new AuthRequiredEvent(sessionId));
    }
}

module.exports = GameClientService;