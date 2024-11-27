function execute(data) {
    const client = data.client
    if (data.username === client.username) return client.core.tellraw(
        new client.ChatMessage.MessageBuilder().setText("Kys u spammer").setColor('red')
    )
    client.chat(data.message.trim().substring(0, 999))
}

module.exports = {
    name: "echo",
    description: "Echos a message",
    usage: [
        "echo <message>"
    ],
    level: 'public',
    aliases: [
        "say"
    ],
    execute: execute
}