import SocketIO from 'socket.io';
import SocketRouter from 'socket.io-events';
import GameEvent from '../common/models/game-event';
import AuthReceivedEvent from '../common/models/auth-received-event';
import JwtAuthReceivedEvent from '../common/models/jwt-auth-received-event';
import AuthRequiredEvent from '../common/models/auth-required-event';

const sessionMap = {};

const socketRouter = SocketRouter();

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
    console.log('user attempting to log in');
    const authType = args[1];
    if(authType === 'jwt') {
        const jwtToken = args[2];
        const jwtEvent = new JwtAuthReceivedEvent(jwtToken);
        jwtEvent.validate()
            .then(() => {
                console.log('successfully logged in');
            })
            .catch((err) => {
                console.log('error logging in' + JSON.stringify(err));
            })
    }
    else {
        console.log('unknown ath type: ' + authType)
    }
});

const io = SocketIO(8080);
io.use(socketRouter);

io.on('connection', (socket) => {
    console.log('Connection');
    socket.emit(GameEvent.prototype.GAME_EVENT_KEY, new GameEvent('test'));
});