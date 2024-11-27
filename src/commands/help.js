function execute(data) {
    const client = data.client
    const commands = client.commandHandler.commands
    if (data.message) {
        const command = commands.find(cmd => cmd.name === data.message.split(' ')[0].toLowerCase() || cmd.aliases.includes(data.message.split(' ')[0].toLowerCase()));
        if (!command) {
            client.core.tellraw(
                new client.ChatMessage.MessageBuilder().setTranslate("| %s: %s: %s").setColor(client.scheme.publicColor).addWith(
                    new client.ChatMessage.MessageBuilder().setText("Error").setColor(client.scheme.errorColor),
                    new client.ChatMessage.MessageBuilder().setText("Command not found").setColor(client.scheme.trustedColor),
                    new client.ChatMessage.MessageBuilder().setText(data.message.split(' ')[0]).setColor(client.scheme.consoleColor),
                ).toJSON()
            )
            return
        }
        const d = {
            name: command.name,
            desc: command.description,
            aliases: command.aliases,
            usages: command.usage,
            level: command.level
        }

        client.core.tellraw(
            new client.ChatMessage.MessageBuilder().setTranslate(`| %s: %s\n| %s: %s\n| %s: %s\n| %s: \n[%s]\n| %s: %s`).setColor(client.scheme.consoleColor).addWith(
                new client.ChatMessage.MessageBuilder().setText("Name").setColor(client.scheme.publicColor),
                new client.ChatMessage.MessageBuilder().setText(d.name).setColor(client.scheme.defaultColor),

                new client.ChatMessage.MessageBuilder().setText("Description").setColor(client.scheme.publicColor),
                new client.ChatMessage.MessageBuilder().setText(d.desc).setColor(client.scheme.defaultColor),

                new client.ChatMessage.MessageBuilder().setText("Aliases").setColor(client.scheme.publicColor),
                new client.ChatMessage.MessageBuilder().setText(d.aliases.join(", ")).setColor(client.scheme.defaultColor),

                new client.ChatMessage.MessageBuilder().setText("Usages").setColor(client.scheme.publicColor),
                new client.ChatMessage.MessageBuilder().setText(d.usages.map(usage => `"${usage}"`).join('\n')).setColor(client.scheme.defaultColor),

                new client.ChatMessage.MessageBuilder().setText("Perm Lvl").setColor(client.scheme.publicColor),
                new client.ChatMessage.MessageBuilder().setText(d.level.toUpperCase()).setColor(client.scheme.defaultColor),  
            ).toJSON()
        )
        return
    } else {
        const perms = {
            public: 1,
            trusted: 2,
            owner: 3
        };
        
        const sorted = commands.sort((a, b) => {
            return (perms[a.level] || 0) - (perms[b.level] || 0);
        });
        
        const commandslist = sorted.map(command => {
            return new client.ChatMessage.MessageBuilder()
                .setText(command.name+' ')
                .setColor(
                    command.level === "owner" ? client.scheme.ownerColor :
                    command.level === "trusted" ? client.scheme.trustedColor :
                    command.level === "public" ? client.scheme.publicColor :
                    client.scheme.errorColor
                );
        });
        
        client.core.tellraw(
            new client.ChatMessage.MessageBuilder()
                .setTranslate('Commands: %s%s%s | %s | %s | %s \u203a \n%s')
                .setColor(client.scheme.consoleColor)
                .addWith(
                    new client.ChatMessage.MessageBuilder().setText("{ ").setColor(client.scheme.publicColor),
                    new client.ChatMessage.MessageBuilder().setText(commandslist.length.toString()).setColor(client.scheme.defaultColor),
                    new client.ChatMessage.MessageBuilder().setText(" }").setColor(client.scheme.publicColor),
                    new client.ChatMessage.MessageBuilder().setText("Public").setColor(client.scheme.publicColor),
                    new client.ChatMessage.MessageBuilder().setText("Trusted").setColor(client.scheme.trustedColor),
                    new client.ChatMessage.MessageBuilder().setText("Owner").setColor(client.scheme.ownerColor),
                    new client.ChatMessage.MessageBuilder().setTranslate("%s".repeat(commandslist.length)).addWith(
                        ...commandslist
                    )
                ).toJSON()
        );
    }
};


module.exports = {
    name: "help",
    description: "Useless help command",
    usage: [
        "help <cmd>"
    ],
    level: 'public',
    aliases: [
        "heko",
        "commands",
        "cmds",
        "h",
        "helpikilledafamilyof5",
        "denislikesmen",
        "gelp",
        "hel",
        "elp"
    ],
    execute: execute
}