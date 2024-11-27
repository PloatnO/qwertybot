function execute(data) {
    const client = data.client
    client.core.move()
}

module.exports = {
    name: "rc",
    description: "Refills the bots core!!",
    usage: [
        "rc"
    ],
    level: 'public',
    aliases: [
        "refillcore"
    ],
    execute: execute
}