const SocketIO = require('socket.io');
const SocketRouter = require('socket.io-events');
const config = require('config');
const uuid = require('uuid/v4');
const Session = require('./../common/model/session');
const DuplicateSessionEvent = require('../common/events/duplicate-session-event');
const SessionTokenCreatedEvent = require('../common/events/session-token-created-event');

class GameClientAdapter {

    constructor(authMiddleware, accessLogMiddleware, eventRouterMiddleware, sessionRepository) {
        this.authMiddleWare = authMiddleware;
        this.accessLogMiddleware = accessLogMiddleware;
        this.sessionRepository = sessionRepository;
        this.eventRouterMiddleware = eventRouterMiddleware;
    }

    start(port=8080) {
        this.io = SocketIO(port);

        this._registerRoutes(this.io);
        this.io.on('connection', this._onNewConnection.bind(this));
    }

    _registerRoutes(socketIo) {
        this._router.use(SocketRouter(socketIo));

        if(this.accessLogMiddleware) {
            this._router.on(this.accessLogMiddleware);
        }

        if(this.authMiddleWare) {
            this._router.on(this.authMiddleWare);
        }

        this._router.on(this.eventRouterMiddleware);

    }

    /**
     * @param {String} socketId
     * @param {String} eventPath
     * @param {Event} event
     */
    sendEvent(socketId, eventPath, event) {
        this.io.sockets[socketId].emit(eventPath, event); //TODO THIS IS INCORRECT
    }

    async _onNewConnection(socket) {
        console.log('Connection');

        socket.on('disconnect', () => this._onDisconnect(socket).bind(this));

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

    findSocketBySocketId(socketId) {
        throw new Error('do this');

    }

    _onDisconnect(socket) {
        console.log(`Socket ${socket.id} disconnected`);
        this.sessionRepository.deleteSessionLockBySocketId(socket.id);
    }
}

module.exports = GameClientAdapter;