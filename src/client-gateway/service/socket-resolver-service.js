class SocketResolverService {

    /**
     * @param {SessionRepository} sessionRepository
     * @param {SocketIO} socketIo
     */
    constructor(sessionRepository, socketIo) {
        this._sessionRepository = sessionRepository;
        this._socketIo = socketIo;
    }

    resolveSocket(sessionId) {
        const socketId = this._sessionRepository.findSocketIdBySessionId(sessionId);

        if(!socketId) {
            console.error(`Socket does not exist on this node with sessionId: ${sessionId}`);
            return null;
        }
    }
}

module.exports = SocketResolverService;