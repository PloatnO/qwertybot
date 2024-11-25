const fs = require('fs').promises
const { Logger } = require('./Logger');
const path = require('path')
const util = require('util')
class CommandHandler {
    constructor(client) {
        this.client = client
        this.filePath = '../commands'

        this.logger = new Logger({ host: 'CmdHandler', port: '' });
        this.init()
    }

    async init() {
        this.commands = []
        this.Filecommands = []
        this.logger.debug(`Loading Commands...`)
        await this.getCommands()
        this.logger.debug('Commands Loaded')
        this.regIngame()
    }

    async getCommands() {
        const filePath = path.join(__dirname, this.filePath);
        this.Filecommands = await fs.readdir(filePath);
        for (const c of this.Filecommands) {
            const cmd = require(path.join(filePath, c));
            this.commands.push(cmd);
        }
    }
    
    async regIngame() {
        const prefixes = this.client.config.prefixes;
        this.client.on('parsedchat', (packet) => {
            const data = {
                username: packet.username,
                command: packet.message.split(' ')[0],
                message: packet.message.split(' ').slice(1).join(' '),
                uuid: packet.uuid,
                customchat: packet.chipmunkmod,
                rawMsg: packet .rawMessage
            };
            prefixes.forEach(c => {
                const commandSuffix = data.command.slice(c.length);
                if (data.command.startsWith(c)) {
                    const cmd = this.commands.find(b => b.name === commandSuffix);
                    if (cmd) {
                        const hash = data.message.split(' ')[0];
                        this.logger.log(hash)
                        this.logger.log(this.client.hashes.owner)
                        const isauth = (cmd.level === 'owner' && hash === this.client.hashes.owner) ||
                                            (cmd.level === 'trusted' && hash === this.client.hashes.trusted) ||
                                            cmd.level === 'public';
    
                        if (isauth) {
                            cmd.execute({
                                client: this.client,
                                ...data
                            });
                        } else {
                            this.client.core.tellraw(
                                new this.client.ChatMessage.MessageBuilder().setTranslate("[%s] %s %s").setColor(this.client.scheme.errorColor).addWith(
                                    new this.client.ChatMessage.MessageBuilder().setText("Error").setColor(this.client.scheme.publicColor),
                                    new this.client.ChatMessage.MessageBuilder().setText(":").setColor(this.client.scheme.publicColor),
                                    new this.client.ChatMessage.MessageBuilder().setTranslate("Invalid Hash: %s").setColor(this.client.scheme.errorColor).addWith(
                                        new this.client.ChatMessage.MessageBuilder().setText(hash).setColor(this.client.scheme.publicColor)
                                    )
                                )
                            );
                        }
                    } else {
                        this.client.core.tellraw(
                            new this.client.ChatMessage.MessageBuilder().setTranslate("[%s] %s %s").setColor(this.client.scheme.errorColor).addWith(
                                new this.client.ChatMessage.MessageBuilder().setText("Error").setColor(this.client.scheme.publicColor),
                                new this.client.ChatMessage.MessageBuilder().setText(":").setColor(this.client.scheme.publicColor),
                                new this.client.ChatMessage.MessageBuilder().setTranslate("Command Not Found: %s").setColor(this.client.scheme.errorColor).addWith(
                                    new this.client.ChatMessage.MessageBuilder().setText(commandSuffix).setColor(this.client.scheme.publicColor)
                                )
                            )
                        );
                    }
                }
            });
        });
    }
}

module.exports = { CommandHandler }