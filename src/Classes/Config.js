// index.js
const fs = require('fs').promises;
const yaml = require('yaml');
const path = require('path');
const { Logger } = require('./Logger'); // Ensure Logger is implemented correctly
const configFilePath = path.join(__dirname, '../config.yaml');

class Config {
    constructor() {
        this.logger = new Logger({ host: 'Server', port: '' });
    }

    async init() {
        try {
            const nonParsedConfig = await fs.readFile(configFilePath, 'utf8');
            const parsedConfig = yaml.parse(nonParsedConfig);
            return parsedConfig;
        } catch (error) {
            this.logger.log('Error loading configuration: ' + error);
            throw error;
        }
    }
}

module.exports = { Config };