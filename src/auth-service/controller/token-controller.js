const RestifyErrors = require('restify-errors');

class AuthController {

    /**
     * @param {SessionRepository} sessionRepository
     * @param {GameEngineService} gameEngineService
     */
    constructor(sessionRepository, gameEngineService) {
        this._sessionRepository = sessionRepository;
        this._gameEngineService = gameEngineService;
    }

    async handleSessionAuthentication(req, res) {
        const sessionId = req.param('sessionId');

        if(!sessionId) {
            console.error('session id was not provided');
            return res.send(new RestifyErrors.InvalidArgumentError('No session id provided!'));
        }

        console.log(`Retrieved request to authenticate session ${req.param('sessionId')}`);

        if(!this._sessionRepository.sessionExists(sessionId)) {
            console.error(`Session with id ${sessionId} doesnt exist!`);
            return res.send(new RestifyErrors.NotFoundError(`Session with id ${sessionId} does not exist`));
        }

        try {
            this._sessionRepository.setSessionField(sessionId, 'authenticated', true);
            this._gameEngineService.sendSessionAuthenticatedSucceededEvent(sessionId);

            res.send('Authenticated!');
        } catch(e) {
            console.error(`Error setting authenticated flag on session with id ${sessionId} ${e.message}`);
        }
    }
}

module.exports = AuthController;