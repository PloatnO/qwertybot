function execute(data) {
    const client = data.client
    client.core.tellraw(
        new client.ChatMessage.MessageBuilder().setTranslate("| %s: %s\n| %s: %s\n| %s: %s").setColor(client.scheme.consoleColor).addWith(
            new client.ChatMessage.MessageBuilder().setText("User").setColor(client.scheme.publicColor),
            new client.ChatMessage.MessageBuilder().setText(data.username).setColor(client.scheme.trustedColor),

            new client.ChatMessage.MessageBuilder().setText("UUID").setColor(client.scheme.publicColor),
            new client.ChatMessage.MessageBuilder().setText(data.uuid).setColor(client.scheme.trustedColor).setClickEvent('copy_to_clipboard', data.uuid).setHoverEvent('show_text', new client.ChatMessage.MessageBuilder().setText("Click to copy the uuid").setColor(client.scheme.consoleColor)),

            new client.ChatMessage.MessageBuilder().setText("Args").setColor(client.scheme.publicColor),
            new client.ChatMessage.MessageBuilder().setText(data.message).setColor(client.scheme.trustedColor),
        )
    )
}

module.exports = {
    name: "testo",
    description: "Test Owner command",
    usage: [
        "testo <>"
    ],
    level: 'owner',
    execute: execute
}