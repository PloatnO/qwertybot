const fs = require('fs').promises
const { exec } = require('child_process');
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
        this.client.commandHandler = {
            commands: this.commands,
            execute: (data) => this.executeCommand(data),
            excludedCommands: new Set()
        }
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

    async executeCommand(data) {
        const hash = data.message.split(' ')[0].trim();
    
        function mapHash(hash) {
            return hash.split('').map(char => '§' + char).join('') + '§r';
        }
    
        const ownerHash = this.client.hashes.owner;
        const trustedHash = this.client.hashes.trusted;
        const mappedOwnerHash = mapHash(ownerHash);
        const mappedTrustedHash = mapHash(trustedHash);
    
        const cmd = this.commands.find(b => b.name === data.command || b.aliases.includes(data.command));
    
        if (!cmd) {
            this.client.core.tellraw(
                new this.client.ChatMessage.MessageBuilder().setTranslate("[%s] %s %s").setColor(this.client.scheme.errorColor).addWith(
                    new this.client.ChatMessage.MessageBuilder().setText("Error").setColor(this.client.scheme.publicColor),
                    new this.client.ChatMessage.MessageBuilder().setText(":").setColor(this.client.scheme.publicColor),
                    new this.client.ChatMessage.MessageBuilder().setTranslate("Command Not Found: %s").setColor(this.client.scheme.errorColor).addWith(
                        new this.client.ChatMessage.MessageBuilder().setText(data.command).setColor(this.client.scheme.publicColor)
                    )
                )
            );
            return;
        }

        this.logger.log(data.message)
    
        const isPublicCommand = cmd.level === 'public';
        const isAuth = (cmd.level === 'owner' && (hash === ownerHash || hash === mappedOwnerHash)) ||
                        (cmd.level === 'trusted' && (hash === trustedHash || hash === ownerHash || hash === mappedOwnerHash || hash === mappedTrustedHash));

        if (isPublicCommand || isAuth) {
            await cmd.execute({
                client: this.client,
                ...data,
                message: isPublicCommand ? data.message : data.message?.split(' ').slice(1).join(' ')
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
    }
    
    async regIngame() {
        const prefixes = this.client.config.prefixes;
        this.client.on('parsedchat', (packet) => {
            const data = {
                username: packet.username,
                command: packet.message.split(' ')[0],
                message: packet.message.split(' ').slice(1).join(' ').trim(),
                uuid: packet.uuid,
                customchat: packet.chipmunkmod,
                rawMsg: packet.rawMessage
            };
    
            prefixes.forEach(c => {
                const commandSuffix = data.command.slice(c.length).toLowerCase();
                if (data.command.startsWith(c)) {
                    data.command = commandSuffix; 
                    this.executeCommand(data);
                }
            });
        });
    }

}

module.exports = { CommandHandler }