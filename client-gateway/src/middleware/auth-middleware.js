const config = require('config');
const AuthRequiredEvent = require('adventure-game-common/events/auth-required-event');

/**
 * @param {SessionRepository} sessionRepository
 * @param {GameClientEngineAdapter} gameClientEngineAdapter
 * @constructor
 */
function AuthMiddleware (sessionRepository, gameClientEngineAdapter) {
    return async function requireAuth(sock, args, next) {
        const session = await sessionRepository.findSessionByOwnerSocketId(sock.id);

        console.log('Checking auth status of socket id ' + sock.id);
        console.log(JSON.stringify(session));

        if (!session) {
            console.error(`Socket id ${sock.id} does not have an associated session`);
            throw new Error('Socket id ${sock.id} does not have an associated session');
        }
        const isAuthenticated = session.authenticated === true;

        if (!isAuthenticated) {
            console.log(`Session ${session.sessionId} is not authenticated`)
        }

        if (!config.requireAuth || isAuthenticated || args[0] === 'authEvent') {
            console.log('Passing event through authBlocker ' + sock.id);
            next();
        } else {
            gameClientEngineAdapter.sendEventToClient(session.sessionId, new AuthRequiredEvent(session.sessionId));
            console.log('Blocking request, authRequired required for session id ' + sock.id);
        }
    }
}

module.exports = AuthMiddleware;
