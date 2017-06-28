/**
 * @param {EventFactory} eventFactory
 * @param {EventRouter} clientEventRouter
 * @returns {routeEvent}
 */
module.exports = (eventFactory, clientEventRouter) => {
    return function routeEvent(sock, args, next) {
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
    }
};