const SessionTokenCreatedEvent = require('adventure-game-common/events/session-token-created-event');
const DuplicateSessionEvent = require('adventure-game-common/events/duplicate-session-event');
const Session = require('adventure-game-common/model/session');
const uuid = require('uuid');

class GameClientEngineAdapter {

    /**
     * @param {GameClientService} gameClientService
     * @param {GameEngineService} gameEngineService
     * @param {SocketIdSessionIdResolverService} socketIdSessionIdResolverService
     * @param {SessionRepository} sessionRepository
     * @param {AuthService} authService
     */
    constructor(gameClientService, gameEngineService, socketIdSessionIdResolverService, sessionRepository, authService) {
        this.gameClientService = gameClientService;
        this.gameEngineService = gameEngineService;
        this.socketIdSessionIdResolverService = socketIdSessionIdResolverService;
        this.sessionRepository = sessionRepository;
        this.authService = authService;
    }

    /**
     * @param {String} socketId
     * @param {String} existingSessionId
     * @return {String}
     */
    async createSession(socketId, existingSessionId) {
        let sessionId = existingSessionId;
        let session;

        if(!sessionId) {
            console.log('Creating new session..');

            try {
                sessionId = await this.sessionRepository.createNewSessionId();
            } catch(err) {
                console.error(err);
                //TODO DO something if a session can't be created. I.e raise an event and send it to the client
            }

            const session = new Session(sessionId);

            console.log('Creating session with session id: ' + sessionId);
            await this.sessionRepository.createSession(session);
        }

        try {
            const lockCreated = await this.sessionRepository.createSessionLock(socketId, sessionId);

            if(!lockCreated) {
                console.error('Another session exists with this session id');
                const duplicateSessionEvent = new DuplicateSessionEvent(sessionId);
                this.sendEventToClientWithSocketId(socketId,duplicateSessionEvent);
                return null;
            }
        } catch(err) {
            console.error('Error creating session lock: ' + JSON.stringify(err));
            return null;
        }

        let signedSessionToken;
        try {
            signedSessionToken = await this.authService.signToken({sessionId});
        } catch(err) {
            console.error('Error signing token for sessionId: ' + sessionId);
            return null;
        }

        const sessionTokenCreatedEvent = new SessionTokenCreatedEvent(signedSessionToken);

        this.sendEventToClientWithSocketId(socketId, sessionTokenCreatedEvent);

        return sessionId;
    }

    /**
     * @param {String} sessionId
     */
    deleteSession(sessionId) {
        this.sessionRepository.deleteSessionLock(sessionId);
        return this.sessionRepository.deleteSession(sessionId);
    }

    /**
     * @param {String} sessionId
     * @param {Event} event
     */
    sendEventToClient(sessionId, event) {
        const socketId = this.socketIdSessionIdResolverService.resolveSocketId(sessionId);

        return this.gameClientService.sendEvent(socketId, event);
    }

    /**
     * @param {String} socketId
     * @param {Event} event
     */
    sendEventToClientWithSocketId(socketId, event) {
        return this.gameClientService.sendEvent(socketId, event);
    }

    /**
     * @param {String} socketId
     * @param {Event} event
     */
    sendEventToEngine(socketId, event) {
        const sessionId = this.socketIdSessionIdResolverService.resolveSessionId(socketId);

        // Inject session id into event
        event.sessionId = sessionId;

        return this.gameEngineService.sendEvent(sessionId, event);
    }
}

module.exports = GameClientEngineAdapter;
