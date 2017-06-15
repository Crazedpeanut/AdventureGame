const {Console, Events} = require('./console');
const ServerAdapter = require('./server-adapter');

const console = new Console(process.stdin, process.stdout);
console.isDebugMode = true;

console.on(Events.COMMAND_EVENT, (command) => {
    switch(command.commandKey) {
        case 'exit': {
            console.writeToConsole('Exiting the game.');
            process.exit(0);
        } break;
    }
});

const serverAdapter = new ServerAdapter('http://localhost:8080/');
serverAdapter.connect();