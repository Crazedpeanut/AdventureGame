const LOG_LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARNING: 'WARNING',
    SECURITY: 'SECURITY',
    ERROR: 'ERROR'
};

const debug = console.debug;
const info = console.info;
const warning = console.warn;
const security = console.warn;
const error = console.error;

module.exports = {
    debug,
    info,
    warning,
    security,
    error
};