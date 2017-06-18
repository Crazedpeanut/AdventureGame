const _ = require('lodash');
const EventRouter = require('./event-router.interface');

class AbstractEventRouter extends EventRouter {
    constructor() {
        super();
        this.routes = [];
        this.handlers = [];
    }

    registerHandler(routeRegExp, eventHandler) {
        this.handlers.push({
            routeRegExp,
            eventHandler
        });
    }

    registerRouter(routeRegExp, eventRouter) {
        this.routes.push({
            routeRegExp,
            eventRouter
        });
    }

    findHandler(eventPath) {
        // Check if this Router holds a matching handler
        let handler = _.findLast(this.handlers, handler => handler.routeRegExp.test(eventKey));

        if(handler) return handler;

        // Check child routes if they have a matching handler
        const matchingRouter = _.findLast(this.routes, route =>
           route.routeRegExp.test(eventKey)
        );

        // If no matching routers exist
        if(!matchingRouter) return null;

        // Strip of portion of event key that matches the route regexp
        const matchingEventKeyPortion = matchingRouter.routeRegExp.exec(eventKey);
        console.log(`Matching event key portion: ${matchingEventKeyPortion}`);
        const stippedEventKey = eventKey.subString(matchingEventKeyPortion.length);
        console.log('Stripped event key: ' + stippedEventKey);

        handler = matchingRouter.eventRouter.findHandler(stippedEventKey);

        return handler;
    }

    listRoutes() {
        const childRoutes = _.map(this.routes, route => route.listRoutes());
        const routes = childRoutes.concat(this.routes);

        return _.map(routes.concat(this.handlers), route => route.routeRegExp);
    }
}

module.exports = AbstractEventRouter;