class AuthEventReceived {
    validate() {}
    get userId() {}
    get authExpiryDate() {}
}

AuthEventReceived.prototype.AUTH_EVENT_KEY = 'authEvent';

module.exports = AuthEventReceived;