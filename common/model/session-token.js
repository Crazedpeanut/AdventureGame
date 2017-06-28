class SessionToken {
    constructor(sessionId, timeSigned, expires) {
        this.sessionId = sessionId;
        this.timeSigned = timeSigned;
        this.expires = expires;
    }
}

module.exports = SessionToken;