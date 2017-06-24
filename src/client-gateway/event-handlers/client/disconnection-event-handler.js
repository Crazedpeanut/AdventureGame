const GameClientEventHandler = require('../game-client-event-handler.abstract');

class ConnectionEventHandler extends GameClientEventHandler {

    /**
     * @param {AuthSucceededEvent} event
     */
    handleEvent(event) {
        const sessionToken = socket.request.headers.sessionToken;
        let sessionId;
        let session;

        if(sessionToken) {
            console.log(`session token in header ${socket.id} ${sessionToken}`);
            sessionId = await Session.validateSessionToken(sessionToken);

            if(!sessionId) {
                console.log('session invalid for token ' + sessionToken);
                socket.disconnect();
                return null;
            } else {
                session = await this.sessionRepository.getSessionById(sessionId);
            }
        } else {
            sessionId = uuid();
            session = new Session(sessionId);

            const sessionTokenCreatedEvent = new SessionTokenCreatedEvent(session.createSessionToken());
            socket.emit(sessionTokenCreatedEvent.eventName, sessionTokenCreatedEvent);

            console.log(`Session with id ${sessionId} does not exist yet. Creating a new one`);
            this.sessionRepository.createSession(session);
            console.log(`Created a session with id ${sessionId} and socket id: ${socket.id}`);
        }

        console.log('Check session lock status');
        if(await !this.sessionRepository.createSessionLock(socket.id, sessionId)) {
            console.log('Session locked!');
            const duplicateSessionEvent = new DuplicateSessionEvent();
            socket.emit(duplicateSessionEvent.eventName, duplicateSessionEvent);
            socket.disconnect();
            return null;
        } else {
            console.log(`Session was unlocked. Created a session lock for id ${sessionId} and owned by socket id: ${socket.id}`);
        }
    }
}

module.exports = AuthSucceededEventHandler;