class EventRouter {
    /**
     * @param {String} eventPath
     * @return EventHandler
     */
    findHandler(eventPath) {}

    /**
     * @param {RegExp} routeRegExp
     * @param {EventHandler} eventHandler
     */
    registerHandler(routeRegExp, eventHandler) {}

    /**
     * @param {RegExp} routeRegExp
     * @param {EventRouter} eventRouter
     */
    registerRouter(routeRegExp, eventRouter) {}

    /**
     *  @return {[String]}
     */
    listRoutes() {}
}

module.exports = EventRouter;