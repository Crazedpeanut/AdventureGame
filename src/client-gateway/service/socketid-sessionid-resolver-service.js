class SocketResolverService {

    /**
     * @param {SessionRepository} sessionRepository
     * @param {GameClientAdapter} gameClientAdapter
     */
    constructor(sessionRepository, gameClientAdapter) {
        this._sessionRepository = sessionRepository;
        this._gameClientAdapter = gameClientAdapter;
    }

    resolveSocket(sessionId) {
        const socketId = this._sessionRepository.findSocketIdBySessionId(sessionId);

        if(!socketId) {
            console.error(`Socket does not exist on this node with sessionId: ${sessionId}`);
            return null;
        }

        return this._gameClientAdapter.findSocketBySocketId(sessionId);
    }
}

module.exports = SocketResolverService;