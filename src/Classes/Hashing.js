const crypto = require('crypto')
class Hashing {
    constructor(client) {
        this.client = client
        this.init()
    }

    async init() {
        setInterval(()=>{
            const hashes = {
                trusted: crypto.createHash('sha256').update(Math.floor(Date.now() / 1000) + this.client.config.bot.keys.trusted).digest('hex').substring(0, 16),
                owner: crypto.createHash('sha256').update(Math.floor(Date.now() / 1000) + this.client.config.bot.keys.owner).digest('hex').substring(0, 16),
              }
            this.client.hashes = hashes
        }, 100)
    }
}

module.exports = { Hashing }