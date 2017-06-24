class SocketIdSessionIdResolverService {

    /**
     * @param {SessionRepository} sessionRepository
     */
    constructor(sessionRepository,) {
        this.sessionRepository = sessionRepository;
    }

    resolveSocketId(sessionId) {
        const socketId = this.sessionRepository.findSocketIdBySessionId(sessionId);

        if(!socketId) {
            console.error(`Socket does not exist on this node with sessionId: ${sessionId}`);
            return null;
        }

        return socketId;
    }

    resolveSessionId(socketId) {
        const sessionId = this.sessionRepository.findSocketIdBySessionId(socketId);

        if(!sessionId) {
            console.error(`Session does not exist on this node with socketId: ${socketId}`);
            return null;
        }

        return sessionId;
    }
}

module.exports = SocketIdSessionIdResolverService;