const fs = require('fs'); // Assuming you want to use 'fs' for file operations
const {Logger} = require('./Logger'); // Assuming you have a Logger class defined elsewhere

class Console {
    constructor(clients) {
        this.clients = clients;
        this.logger = new Logger({ host: 'Konsole', port: '' });
        this.init();
    }

    init() {
        this.logger.debug('Console initialized.');
        this.startListening();
    }

    startListening() {
        process.stdin.on('data', (data) => {
            const input = data.toString().trim();
            this.handleInput(input);
        });
    }

    handleInput(input) {
        if (input === 'exit') {
            this.logger.error('Exiting console...');
            process.exit();
        } else {
            this.clients.forEach(client => {
                try {
                    client.core.tellraw(
                        new client.ChatMessage.MessageBuilder().setTranslate("[%s] %s \u203a %s").addWith(
                            new client.ChatMessage.MessageBuilder().setText("Q(werty)Bot-Console").setColor(client.scheme.consoleColor),
                            new client.ChatMessage.MessageBuilder().setText(client.username).setColor(client.scheme.trustedColor),
                            new client.ChatMessage.MessageBuilder().setText(input).setColor(client.scheme.publicColor)
                        )
                        
                        .toJSON()
                    )
                } catch {}
        });
        }
    }
}

module.exports = { Console }