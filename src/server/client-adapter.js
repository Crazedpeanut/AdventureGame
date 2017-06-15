import SocketIO from 'socket.io';
import SocketRouter from 'socket.io-events';
import GameEvent from '../common/models/game-event';
import AuthReceivedEvent from '../common/models/auth-received-event';
import EventFactory from '../common/factory/event-factory';
import AuthRequiredEvent from '../common/models/auth-required-event';
import AuthSuccededEvent from '../common/models/auth-succeeded-event';
import AuthFailedEvent from '../common/models/auth-failed-event';

const sessionMap = {};

const socketRouter = SocketRouter();
const eventFactory = new EventFactory();

socketRouter.on(function requireAuth(sock, args, next){
    console.log(sock.id);
    if(sessionMap[sock.id] || args[0] == AuthReceivedEvent.prototype.AUTH_EVENT_KEY) {
        next();
    } else {
        sock.emit(AuthRequiredEvent.prototype.AUTH_REQUIRED_EVENT_KEY, new AuthRequiredEvent());
        console.log('Auth required for session id ' + sock.id);
    }
});


socketRouter.on(GameEvent.prototype.GAME_EVENT_KEY, (sock, args, next) => {
    console.log('game event');
});

socketRouter.on(AuthReceivedEvent.prototype.AUTH_EVENT_KEY, (sock, args, next) => {
    console.log('auth event');
    const authEvent = eventFactory.createEvent(args[0], args.splice(1));

    if(authEvent.authEventType === 'authReceived') {
        console.log('authReceived event');

        authEvent.validate()
            .then(() => {
                console.log('login success');
                const successEvent = new AuthSuccededEvent();
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