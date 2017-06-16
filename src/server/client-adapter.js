const SocketIO = require('socket.io');
const SocketRouter = require('socket.io-events');
const GameEvent = require('../common/models/game-event');
const EventFactory = require('../common/factory/event-factory');
const AuthRequiredEvent = require('../common/models/auth-required-event');
const AuthSucceededEvent = require('../common/models/auth-succeeded-event');
const AuthFailedEvent = require('../common/models/auth-failed-event');
const config = require('config');

const sessionMap = {};
const socketRouter = SocketRouter();
const eventFactory = new EventFactory();

socketRouter.on(function recordSocketId(sock, args, next){
   if (!sessionMap[sock.id]) sessionMap[sock.id] = true;
   next();
});

socketRouter.on(function logRequest(sock, args, next){
    console.log(`Received event ${sock.id} ${JSON.stringify(args)}`);
    next();
});

socketRouter.on(function requireAuth(sock, args, next){
    if(!config.requireAuth || args[0] === 'authEvent') {
        console.log('Passing event through authBlocker' + sock.id);
        next();
    } else {
        const authRequiredEvent = new AuthRequiredEvent(sock.id);
        sock.emit(authRequiredEvent.eventName, authRequiredEvent);
        console.log('Blocking request, authRequired required for session id ' + sock.id);
    }
});

socketRouter.on(GameEvent.prototype.GAME_EVENT_KEY, (sock, args, next) => {
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
});

const io = SocketIO(8080);
io.use(socketRouter);

io.on('connection', (socket) => {
    console.log('Connection');
    socket.emit(GameEvent.prototype.GAME_EVENT_KEY, new GameEvent('test'));
});