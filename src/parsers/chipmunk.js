function inject(client) {
    client.on('custom_systemChat', (packet, noColor, jsonMsg) => {
        if (packet.includes('Command set: ')) return;
        const message = jsonMsg;
        if (!message || !message.translate) return;
        
        if (message.translate === '%s %s › %s') {
            const withArgs = message.with;
            if (!withArgs || !Array.isArray(withArgs) || withArgs.length !== 3) return;
        
            const username = withArgs[1];
            const chatMsg = withArgs[2];
            if (!chatMsg) return;

            let selector;
            if (username.hoverEvent?.contents?.id) {
                selector = username.hoverEvent.contents.id;
            }
            
            const chipmunkChat = {
                username: username.text || username.selector,
                message: chatMsg.text + (chatMsg.extra?.[0] || ''),
                uuid: selector,
                CustomChat: true,
                rawMessage: client.ChatMessage.fromNotch(jsonMsg).toAnsi()
            };

            client.emit('parsedchat', chipmunkChat);
        }
        
        if (message.translate === '[%s] %s › %s') {
            const withArgs = message.with;
            if (!withArgs || !Array.isArray(withArgs) || withArgs.length !== 3) return;

            const isTranslator = withArgs[0].text === "Qbot Translator";
            const username = withArgs[1];
            const chatMsg = withArgs[2];
            if (!chatMsg || isTranslator === true) return;


            let selector;
            if (username.hoverEvent?.contents?.id) {
                selector = username.hoverEvent.contents.id;
            }

            const chipmunkChat = {
                username: username.text || username.selector,
                message: chatMsg.text + (chatMsg.extra?.[0] || ''),
                uuid: client.players[username.text || username.selector]?.uuid || 'Invalid User', 
                chipmunkmod: true,
                rawMessage: client.ChatMessage.fromNotch(jsonMsg).toAnsi()
            };
            client.emit('parsedchat', chipmunkChat);
        } else {
            client.emit('nonParsedChat', client.ChatMessage.fromNotch(jsonMsg).toAnsi());
        }
    });
}

module.exports = { inject };
