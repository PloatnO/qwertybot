const { Client } = require('./Classes/Client.js');
const { Config } = require('./Classes/Config.js');
const { Functions } = require('./Classes/Functions.js');
const { Position } = require('./Classes/Position.js')
const { Console } = require('./Classes/Konsole.js')
const { Parser } = require('./Classes/Parser.js')
const { CommandHandler } = require('./Classes/CommandHander.js')
const { Selfcare } = require('./Classes/Selfcare')
const { Hashing } = require('./Classes/Hashing.js')
const ChatParser = require('./chatparser/parser.js')
const ChatMessage = require('prismarine-chat')('1.20.4')
const PlayersFunc = require('./modules/players.js')
const TabCompleteFunc = require('./modules/tab_complete.js')

async function init() {
    const configInstance = new Config()
    const config = await configInstance.init()
    config.servers.forEach(server => {
        startClient({
            ...server
        })
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
        host: options.host,
        port: options.port,
        ...config
    }

    client.scheme = client.config.scheme
    ChatParser.inject(client)
    PlayersFunc.inject(client)
    TabCompleteFunc.inject(client)
    new Parser(client)
    new Functions(client)
    new Position(client)
    new CommandHandler(client)
    new Hashing(client)
    new Selfcare(client)

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