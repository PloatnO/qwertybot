function execute(data) {
    const client = data.client
}

module.exports = {
    name: "info",
    description: "Gets info",
    usage: [
        "info server",
        "info client",
        "info config"
    ],
    level: 'public',
    aliases: [
        "in",
        "if"
    ],
    execute: execute
}