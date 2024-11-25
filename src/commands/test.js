function execute(data) {
    const client = data.client
    client.core.tellraw(`{"text":"test"}`)
}

module.exports = {
    name: "test",
    description: "Test command",
    usage: [
        "test <>"
    ],
    level: 'public',
    execute: execute
}