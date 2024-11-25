const ChatMessage = require('prismarine-chat')('1.20.4')
const protocol = require('minecraft-protocol')
class Client {
    constructor(options) {
        this.options = options
        const client = protocol.createClient({
            username: Math.floor(Math.random() * 2) === 0 ? 'Q(werty)bot' : 'Qbot',
            ...options
        })
        client.config = options
        return client
    }
}

module.exports = { Client }