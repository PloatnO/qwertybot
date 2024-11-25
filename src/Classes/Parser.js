const fs = require('fs').promises
const path = require('path')
const { Logger } = require('./Logger');

class Parser {
    constructor(client) {
        this.client = client
        this.logger = new Logger({ host: 'Parser.js', port: '' });
        this.parses = []
        const parsersDir = '../parsers'
        this.init(parsersDir)
    }

    async init(parsersDir) {
        let parsers
        try {
             parsers = await fs.readdir(path.join(__dirname, parsersDir))
        } catch (e) {
            this.logger.warn('Parsers Failed to load: '+e.stack)
        }
        if (!parsers) {
            this.logger.error('Parsers is not Defined!')
            process.exit(0)
        }
        parsers.forEach((c)=>{
            const parser = require(path.join(__dirname, parsersDir)+'/'+c)
            this.parses.push(parser)
        })
    }
}

module.exports = { Parser }