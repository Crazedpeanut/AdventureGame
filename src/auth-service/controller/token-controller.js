const RestifyErrors = require('restify-errors');

class TokenController {

    /**
     * @param {TokenService} tokenService
     */
    constructor(tokenService) {
        this._tokenService = tokenService;
    }

    async handleTokenSign(req, res, next) {
        const tokenData = req.body;

        if(!tokenData) {
            console.error('tokenData was not provided');
            res.send(new RestifyErrors.InvalidArgumentError('No tokenData provided!'));
            return next();
        }

        console.log(`Retrieved request to sign tokenData`);

        const signedToken = this._tokenService.createToken(tokenData);

        res.send(signedToken);
        next();
    }

    async handleTokenVerify(req, res, next) {
        const encodedToken = req.param('encodedToken');

        if(!encodedToken) {
            console.error('No encoded token provided');
            res.send(new RestifyErrors.InvalidArgumentError('No encodedToken provided!'));
            return next();
        }

        try {
            const validatedToken = await this._tokenService.validateToken(encodedToken);
            res.send(validatedToken);
        } catch(err) {
            res.send(new RestifyErrors.UnprocessableEntityError(err.message));
        }

        next();
    }
}

module.exports = TokenController;