const SocketIO = require('socket.io');
const SocketRouter = require('socket.io-events');
const EventFactory = require('../common/factory/event-factory');
const AuthRequiredEvent = require('../common/events/auth-required-event');
const config = require('config');
const Redis = require('redis');
const uuid = require('uuid/v4');
const SessionRepository = require('././redis-session-repository');
const SessionFactory = require('./../common/factory/session-factory');
const Session = require('./../common/model/session');
const DuplicateSessionEvent = require('../common/events/duplicate-session-event');
const SessionTokenCreatedEvent = require('../common/events/session-token-created-event');
const ClientEventRouterFactory = require('./factory/route-factory/client-route-factory');
const GameClient = require('./service/game-client-service');
const SocketResolverService = require('./service/socket-resolver-service');

const redisSubClient = Redis.createClient();
const redisCacheClient = Redis.createClient();
const socketRouter = SocketRouter();
const clientEventRouter = ClientEventRouterFactory.create();
const eventFactory = new EventFactory();
const sessionFactory = new SessionFactory();
const sessionRepository = new SessionRepository(redisCacheClient, sessionFactory);

const AuthMiddleware = require('./middleware/auth-middleware');

class GameClientAdapter {

    constructor() {
        this.authMiddleWare = AuthMiddleware(sessionRepository);
    }

    start(port=8080) {
        this.io = SocketIO(port);
    }

    /**
     * @param {String} socketId
     * @param {String} eventPath
     * @param {Event} event
     */
    sendEvent(socketId, eventPath, event) {
        this.io.sockets[socketId].emit(eventPath, event); //TODO THIS IS INCORRECT
    }
}

socketRouter.on(function logRequest(sock, args, next){
    console.log(`Received event ${sock.id} ${JSON.stringify(args)}`);
    next();
});

socketRouter.on(this.authMiddleware.bind(this));

socketRouter.on(function routeEvent(sock, args, next) {
    const event = eventFactory.createEvent(args[0], args[1]);

    if(!event) {
        console.error(`Unknown event ${args[0]} from socket id: ${sock.id}`);
        return next();
    }

    const eventHandler = clientEventRouter.findHandler(args[0]);

    if(!eventHandler) {
        console.error(`No event handlers registered for ${args[0]}`);
        return next();
    }

    eventHandler.handleEvent(event, sock);
    return next();
});

/*socketRouter.on('gameEvent', (sock, args, next) => {
    console.log('game event');
});

socketRouter.on('authEvent', (sock, args, next) => {
    console.log('auth event');
    const authEvent = eventFactory.createEvent(args[0], args.splice(1));

    if(authEvent.authEventType === 'authReceived') {
        console.log('authReceived event');

        authEvent.validate()
            .then(() => {
                console.log('login success');
                const successEvent = new AuthSucceededEvent();
                sock.emit(successEvent.eventName, successEvent);
            })
            .catch((err) => {
                console.log('Failed login ' + JSON.stringify(err));
                const failedEvent = new AuthFailedEvent('Invalid JWT');
                sock.emit(failedEvent.eventName, failedEvent);
            })
    }
});*/


const socketResolverService = new SocketResolverService(sessionRepository, io);
const gameClient = new GameClient(sessionRepository, socketResolverService);

io.use(socketRouter);

io.on('connection', (socket) => {

    _handleNewConnection(socket)
        .catch(err => console.error(err));

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
        sessionRepository.deleteSessionLockBySocketId(socket.id);
    })
});

async function _handleNewConnection(socket) {
    console.log('Connection');

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
            session = await sessionRepository.getSessionById(sessionId);
        }
    } else {
        sessionId = uuid();
        session = new Session(sessionId);

        const sessionTokenCreatedEvent = new SessionTokenCreatedEvent(session.createSessionToken());
        socket.emit(sessionTokenCreatedEvent.eventName, sessionTokenCreatedEvent);

        console.log(`Session with id ${sessionId} does not exist yet. Creating a new one`);
        sessionRepository.createSession(session);
        console.log(`Created a session with id ${sessionId} and socket id: ${socket.id}`);
    }

    console.log('Check session lock status');
    if(await !sessionRepository.createSessionLock(socket.id, sessionId)) {
        console.log('Session locked!');
        const duplicateSessionEvent = new DuplicateSessionEvent();
        socket.emit(duplicateSessionEvent.eventName, duplicateSessionEvent);
        socket.disconnect();
        return null;
    } else {
        console.log(`Session was unlocked. Created a session lock for id ${sessionId} and owned by socket id: ${socket.id}`);
    }
}

module.exports = gameClient;