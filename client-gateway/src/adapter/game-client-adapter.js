const SocketIO = require('socket.io');
const SocketRouter = require('socket.io-events');
const ClientConnectedEvent = require('adventure-game-common/events/client-connected-event');
const ClientDisconnectedEvent = require('adventure-game-common/events/client-disconnected-event');

class GameClientAdapter {

    constructor(
        authMiddleware,
        accessLogMiddleware,
        eventRouterMiddleware,
        connectionEventHandler,
        disconnectionEventHandler
    ) {
        this.authMiddleWare = authMiddleware;
        this.accessLogMiddleware = accessLogMiddleware;
        this.eventRouterMiddleware = eventRouterMiddleware;
        this.connectionEventHandler = connectionEventHandler;
        this.disconnectionEventHandler = disconnectionEventHandler;
        this._router = SocketRouter();
    }

    start(port=8080) {
        this.io = SocketIO(port);
        this.io.use(this._router);

        this._registerRoutes(this.io);
        this.io.on('connection', this._onNewConnection.bind(this, this.io));
    }

    _registerRoutes() {

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
        const socket = this.io.sockets.sockets[socketId];

        if(!socket) {
            console.error(`Socket with id ${socketId} doesn't exist!`);
            return;
        }

        console.log(`Sending event ${eventPath}, ${JSON.stringify(event)}`);

        socket.emit(eventPath, event);
    }

    async _onNewConnection(io, socket) {
        console.log('Connection');

        this.connectionEventHandler.handleEvent(new ClientConnectedEvent(socket.id), );

        socket.on('disconnect', () => this._onDisconnect.bind(this));
    }

    _onDisconnect(socket) {
        console.log(`Socket ${socket.id} disconnected`);

        this.disconnectionEventHandler.handleEvent(new ClientDisconnectedEvent(socket.id), );
    }
}

module.exports = GameClientAdapter;
