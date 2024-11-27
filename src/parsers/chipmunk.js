const { Logger } = require('../Classes/Logger');

function inject(client) {
    const logger = new Logger({ host: 'parser', port: '' });

    client.on('custom_systemChat', (packet, noColor, jsonMsg) => {
        if (packet.includes('Command set: ')) return;

        const message = jsonMsg;

        if (!message || !message.translate) return;

        if (message.translate === '%s %s › %s') {
            parseChatMessage(client, message, logger, false);
        } 
        else if (message.translate === '[%s] %s › %s') {
            parseChatMessage(client, message, logger, true);
        } 
        else {
            client.emit('nonParsedChat', client.ChatMessage.fromNotch(jsonMsg).toAnsi());
        }
    });
}

function parseChatMessage(client, message, logger, isChipmunkMod) {
    const withArgs = message.with;

    if (!withArgs || !Array.isArray(withArgs) || withArgs.length !== 3) {
        return;
    }

    const username = withArgs[1];
    const chatMsg = withArgs[2];

    if (!chatMsg) {
        return;
    }

    let selector;
    if (username.hoverEvent?.contents?.id) {
        selector = username.hoverEvent.contents.id;
    } else {
        selector = username.text;
    }

    const chipmunkChat = {
        username: username.text || username.selector,
        message: chatMsg.text + (chatMsg.extra?.[0] || ''),
        uuid: client.players[username.text || username.selector]?.uuid || 'Invalid User',
        chipmunkmod: isChipmunkMod,
        rawMessage: client.ChatMessage.fromNotch(message).toAnsi()
    };


    client.emit('parsedchat', chipmunkChat);
}

module.exports = { inject };