const { Logger } = require('./Logger');
const util = require('util')

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
        if (input.startsWith('.')) {
            if (input.startsWith('.core')) {
                const cmd = input.substring(`.core `.length)
                this.clients.forEach((c)=>{
                    c.core.run(cmd)
                })
            }
        }
        if (input === 'exit') {
            this.logger.error('Exiting console...');
            process.exit();
        } if (input === 'funny') { 
            setInterval(()=>{
                this.clients.forEach((c)=>{
                    c.core.run('say %s',[':00:'.repeat(5000)])
                })
            },1)
        }else {
            this.clients.forEach(client => {
                try {
                    client.core.tellraw(
                        new client.ChatMessage.MessageBuilder().setTranslate("[%s] %s \u203a %s").addWith(
                            new client.ChatMessage.MessageBuilder().setText("Q()Bot-Console").setColor(client.scheme.consoleColor),
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