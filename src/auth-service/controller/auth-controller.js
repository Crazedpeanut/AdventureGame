const RestifyErrors = require('restify-errors');
const AuthSucceededEvent = require('../../common/events/auth-succeeded-event');

class AuthController {

    /**
     * @param {SessionRepository} sessionRepository
     * @param {GameEngineService} gameEngineService
     */
    constructor(sessionRepository, gameEngineService) {
        this.sessionRepository = sessionRepository;
        this.gameEngineService = gameEngineService;
    }

    async handleSessionAuthentication(req, res, next) {
        const sessionId = req.param('sessionId');
        const userId = req.param('userId');

        if(!sessionId) {
            console.error('session id was not provided');
            res.send(new RestifyErrors.InvalidArgumentError('No session id provided!'));
            return next();
        }

        if(!userId) {
            console.error('user id was not provided');
            res.send(new RestifyErrors.InvalidArgumentError('No session id provided!'));
            return next();
        }

        console.log(`Retrieved request to authenticate session ${req.param('sessionId')} with userId ${userId}`);

        if(!await this.sessionRepository.sessionExists(sessionId)) {
            console.error(`Session with id ${sessionId} doesnt exist!`);
            res.send(new RestifyErrors.NotFoundError(`Session with id ${sessionId} does not exist`));
            return next();
        }

        if(await this.sessionRepository.getSessionByUserId(userId)) {
            console.error(`User id: ${userId} already has an active session`);
            res.send(new RestifyErrors.ForbiddenError(`User: ${userId} already has an active session`));
            return next();
        }

        try {
            await this.sessionRepository.setSessionField(sessionId, 'authenticated', true);
            this.gameEngineService.addSessionEvent(sessionId, new AuthSucceededEvent(sessionId));

            res.send('Authenticated!');
        } catch(e) {
            console.error(`Error setting authenticated flag on session with id ${sessionId} ${e.message}`);
            res.send(RestifyErrors.InternalServerError(`Error setting authenticated flag on session with id ${sessionId} ${e.message}`))
        }

        return next();
    }
}

module.exports = AuthController;