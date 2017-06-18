const SessionRepository = require('./session-repository.interface.js');
const _ = require('lodash');

class RedisSessionRepository extends SessionRepository {

    /**
     * @param {RedisClient} redisClient
     * @param {SessionFactory} sessionFactory
     */
    constructor(redisClient, sessionFactory) {
        super();

        this._redisClient = redisClient;
        this._sessionFactory = sessionFactory;
        this._sessionLocks = {};
    }

    async getSessionById(sessionId) {
        console.log('Attempting to get session by sessionId: '+ sessionId);
        const sessionData = await this._redisClient.hgetall(`session:${sessionId}`, (err, reply) => {
            if(err) {
                console.log('Error retrieving session with id %s %s', sessionId, err.message);
                throw new Error(err);
            } else {
                return this._sessionFactory.unFlatten(reply);
            }
        });

        if(sessionData) {
            return this._sessionFactory.fromJson(sessionId, sessionData);
        }
    }

    createSession(session) {
        const flatSession = this._sessionFactory.flatten(session);

        this._redisClient.hmset(...flatSession);
    }

    getSessionByUserId(userId) {

    }

    findSessionIdByOwnerSocketId(socketId) {
        const sessionIds = Object.keys(this._sessionLocks);

        const sessionId = _.findLast(sessionIds, sessionId => this._sessionLocks[sessionId] === socketId);

        if(!sessionId) {
            console.log('Cant find corresponding session id for socket id: ' + socketId);
            return;
        }

        console.log('Found sessionId: %s from socketId %s', sessionId, socketId);
        return sessionId;
    }

    findSessionByOwnerSocketId(socketId) {
        const sessionId = this.findSessionIdByOwnerSocketId(socketId);

        if(!sessionId) return null;

        return this.getSessionById(sessionId);
    }

    async createSessionLock(ownerSocketId, sessionId, ttlSeconds=10, heartbeatIntervalSeconds=8000) {

        const lockResult = await this._redisClient.setnx(`session.lock:${sessionId}`, ownerSocketId, (err, reply) => {
             if(err) {
                 console.error(`Error setting distributed lock for sessionId: ${sessionId}`);
                 throw new Error(err);
             }

             return reply === 1;
        });

        if(!lockResult) return lockResult;

        this._sessionLocks[sessionId] = ownerSocketId;
        this._sessionLockHeartBeat(sessionId, ttlSeconds, heartbeatIntervalSeconds);

        return lockResult;
    }

    _sessionLockHeartBeat(sessionId, ttlSeconds, intervalMs) {
        const currentTtl = this._redisClient.ttl(`session.lock:${sessionId}`);

        console.log('Current Locks: ' + JSON.stringify(this._sessionLocks));

        if(this._sessionLocks[sessionId]) {
            console.log(`Heartbeat: ${sessionId}. Current TTL: ${currentTtl} Postponing expire for ${ttlSeconds} seconds`);

            this._redisClient.expire(`session.lock:${sessionId}`, ttlSeconds);
            setTimeout(this._sessionLockHeartBeat.bind(this, sessionId, ttlSeconds, intervalMs), intervalMs)
        } else {
            console.log(`Heartbeat: ${sessionId}. Letting the lock expire`);
        }
    }

    deleteSessionLock(sessionId) {
        delete this._sessionLocks[sessionId];
        console.log(`Deleted local session lock for ${sessionId}, distributed lock should be remove within the next 10 seconds`);
        console.log(`Current local session locks ${JSON.stringify(this._sessionLocks)}`);
    }

    deleteSessionLockBySocketId(socketId) {
        const sessionId = this.findSessionIdByOwnerSocketId(socketId);
        return this.deleteSessionLock(sessionId);
    }

    findSocketIdBySessionId(sessionId) {
        return this._sessionLocks[sessionId];
    }

    async isSessionLocked(sessionId) {
        return await this._redisClient.get((err, reply) => {
            if(err) {
                console.error(`Error getting lock status ${err.message}`);
                throw new Error(err);
            } else {
                return (reply === true);
            }
        });
    }

    async sessionExists(sessionId) {
        return await this._redisClient.exists(sessionId, (err, reply) => {
            if(err) {
                console.error(`Error checking if sessionId ${sessionId} exists ${err.message}`);
                throw new Error(err);
            }

            console.log(`Redis response for sessionId ${sessionId} exists: ${reply}`);

            return reply === 1;
        })
    }

   async setSessionField(sessionId, keyName, keyVal) {
        console.log(`Setting session ${sessionId} field ${keyName} to ${keyVal}`);
        return await(this._redisClient.hset(sessionId, keyName, keyVal));
    }
}

module.exports = RedisSessionRepository;