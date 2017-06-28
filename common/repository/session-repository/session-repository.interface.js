class SessionRepository {

    /**
     * @param {string} sessionId
     * @return {Promise.<Session>}
     */
    getSessionById(sessionId) {}

    /**
     * @param {string} userId
     * @return {Promise.<Session>}
     */
    getSessionByUserId(userId) {}

    /**
     * @param {String} userId
     * @param {String} sessionId
     */
    associateUserIdWithSession(userId, sessionId) {}

    /**
     * @param {String} socketId
     * @return {String}
     */
    findSessionIdByOwnerSocketId(socketId) {}

    /**
     * @param {String} socketId
     * @return {Promise.<Session>}
     */
    findSessionByOwnerSocketId(socketId){}

    /**
     * @param {String} sessionId
     * @return {String}
     */
    findSocketIdBySessionId(sessionId) {}

    /**
     * @param {Session} session
     */
    createSession(session) {}

    /**
     * @return {String}
     */
    createNewSessionId() {}

    /**
     * @param {String} sessionId
     */
    deleteSession(sessionId) {}

    /**
     * @param {String} ownerSocketId
     * @param {String} sessionId
     * @param {number} ttlSeconds
     * @param {number} heartbeatIntervalSeconds
     * @return {Promise.<boolean>}
     */
    createSessionLock(ownerSocketId, sessionId, ttlSeconds, heartbeatIntervalSeconds) {}

    /**
     * @param {String} sessionId
     */
    deleteSessionLock(sessionId) {}

    /**
     * @param {String} socketId
     */
    deleteSessionLockBySocketId(socketId) {}

    /**
     * @param {String} sessionId
     * @return {Promise.<boolean>}
     */
    isSessionLocked(sessionId) {}

    /**
     * @param {String} sessionId
     * @return {Promise.<boolean>}
     */
    sessionExists(sessionId) {}

    /**
     * @param {String} sessionId
     * @param {String} fieldName
     * @param {*} fieldVal
     * @return {Promise}
     */
    setSessionField(sessionId, fieldName, fieldVal) {}

}

module.exports = SessionRepository;