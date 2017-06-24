const EventEmitter = require('events');

const DEFAULT_COMMAND_DELIMETER = ' ';
const DEFAULT_DEBUG_MODE = false;
const COMMAND_EVENT = 'command';

class Command {
    constructor(commandKey, args, console) {
        this._commandKey = commandKey;
        this._args = args;
        this._console = console;
    }

    toString() {
        return `${this._commandKey} ${JSON.stringify(this._args)}`;
    }

    get commandKey() {
        return this._commandKey;
    }

    set commandKey(value) {
        this._commandKey = value;
    }

    get args() {
        return this._args;
    }

    set args(value) {
        this._args = value;
    }
}

class Console extends EventEmitter {

    constructor(inputStream, outputStream) {
        super();

        this._inputStream = inputStream;
        this._outputStream = outputStream;
        this._commandDelimeter = DEFAULT_COMMAND_DELIMETER;
        this._isDebugMode = DEFAULT_DEBUG_MODE;

        this._inputStream.on('readable', () => {
            const chunk = process.stdin.read();
            if(chunk) {
                const cleanedInputString = this._cleanInputString(chunk.toString());
                const command = this._createCommand(cleanedInputString);
                this.emit(COMMAND_EVENT, command);
            }
        })
    }

    writeToConsole(valueToWrite, debug) {
        if(!debug || this._isDebugMode) {
            this._outputStream.write(String(valueToWrite) + '\n');
        }
    }

    _createCommand(inputString) {
        const commandParts = inputString.split(this._commandDelimeter);
        return new Command(commandParts[0], commandParts.splice(1), this);
    }

    _cleanInputString(dirtyChunk) {

        //Strip linefeeds and newlines
        return dirtyChunk.replace(/[\r\n]/, '');
    }

    set isDebugMode(debugMode) {
        this._isDebugMode = debugMode;
    }

    get isDebugMode() {
        return this._isDebugMode;
    }
}

module.exports =  {
    Console,
    Events: {
        COMMAND_EVENT
    }
};