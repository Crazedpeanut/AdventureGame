class Session {
    constructor(sessionId, userId, authExpires, authenticated=false, worldId=0) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.authExpires = authExpires;
        this.authenticated = authenticated;
        this.worldId = worldId;
        this.createdTimestamp = Date.now();
    }
}

module.exports = Session;