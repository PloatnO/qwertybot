const { Client } = require('./Classes/Client.js');
const { Config } = require('./Classes/Config.js');
const { Functions } = require('./Classes/Functions.js');
const { Core } = require('./Classes/Core.js')
const { Position } = require('./Classes/Position.js')
const { Console } = require('./Classes/Console')
const ChatMessage = require('prismarine-chat')('1.20.4')

async function init() {
    const configInstance = new Config()
    const config = await configInstance.init()
    config.servers.forEach(server => {
        startClient(server)
    });
}

let clients = new Set()

async function startClient(options) {
    const client = new Client(options)
    client.startClient = startClient
    client.serverInfo = options
    const configInstance = new Config()
    const config = await configInstance.init()
    client.ChatMessage = ChatMessage
    client.config = {
        host: client.host,
        port: client.port,
        ...config
    }
    client.scheme = client.config.scheme
    new Functions(client)
    new Position(client)

    clients.add(client)
    client.clients = clients
}

console = {
    "log": () => {},
    "error": () => {},
    "warn": () => {},
    "debug": () => {}
}

new Console(clients)

init();