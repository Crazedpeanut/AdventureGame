const Bull = require('bull');

class GameEngineAdapter {

    /**
     * @param {EventFactory} eventFactory
     * @param {String} redisUrl
     */
    constructor(eventFactory, redisUrl='redis://127.0.0.1:6379') {
        this._eventFactory = eventFactory;
        this._redisUrl = redisUrl;
        this._queues = {};
    }

    addJobQueueListener(key, gameEngineRouter) {
        this._queues[key] = Bull.createQueue(key, this._redisUrl, (job, done) => {
            const eventHandler = gameEngineRouter.findHandler(job.data.eventPath);
            const event = this._eventFactory.createEvent(job.data.eventPath, job.data.event);

            if(!eventHandler) {
                console.error(`Could not find event handler for game engine event: ${job.data.eventPath}`);
                return done(new Error(`Could not find event handler for game engine event: ${job.data.eventPath}`));
            }

            if(!event) {
                console.error(`Could not find event for game engine event: ${job.data.eventPath}`);
                return done(new Error(`Could not find event for game engine event: ${job.data.eventPath}`));
            }

            eventHandler.handleEvent(event);
            done();
        });
    }

    removeJobQueueListener(key) {
        this._queues[key].close();
    }

    addJobToJobQueue(key, eventPath, event) {
        let queue = this._queues[key]; //Try and use one of the existing listener queues

        if(!queue) {
            queue = Bull.createQueue(key);
        }

        queue.add({eventPath, event});
    }

    addBroadcastEventListener(key, gameEngineRouter) {
        //TODO
    }

    removeBroadcastEventListener(key, gameEngineRouter) {
        //TODO
    }

    addBroadcastEvent(key, eventPath, event) {
        //TODO
    }
}

module.exports = GameEngineAdapter;