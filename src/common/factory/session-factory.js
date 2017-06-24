const Session = require('../model/session');

class SessionFactory {
    fromJson(sessionId, sessionData) {
        return new Session(sessionId, sessionData.userId, sessionData.authExpires);
    }

    /**
     * @param {Session} session
     */
    flatten(session) {
        return [
            `session:${session.sessionId}`,
            'authenticated', session.authenticated,
            'authExpires', session.authExpires || '',
            'userId', session.userId || '',
            'worldId', session.worldId
        ]
    }

    /**
     * @param {[String]} sessionData
     */
    unFlatten(sessionData) {

        if(sessionData.length < 9) throw new Error('Can\'t unflatten session data, invalid number of fields');

        return new Session(
            sessionData[0],
            sessionData[2],
            sessionData[4],
            sessionData[6],
            sessionData[8]
        );
    }
}

module.exports = SessionFactory;