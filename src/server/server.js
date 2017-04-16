import winston from 'winston';

export default class Server {
    constructor(httpServer, listenPort=8080) {
        this.httpServer = httpServer;
        this.listenPort = listenPort;
    }

    start() {
        this.httpServer.listen(this.listenPort);
        winston.info(`Start listening on port ${this.listenPort}`);
    }
}

