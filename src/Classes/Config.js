const fs = require('fs').promises;
const yaml = require('yaml');
const path = require('path');
const { Logger } = require('./Logger');
const configFilePath = path.join(__dirname, '../config.yaml');

class Config {
    constructor(config) {
        this._config = config;
    }

    static async load() {
        this.logger = new Logger({ host: 'Server', port: '' });
        try {
            const nonParsedConfig = await fs.readFile(configFilePath, 'utf8');
            const parsedConfig = yaml.parse(nonParsedConfig);
            this.logger.parse(parsedConfig);
            return new Config(parsedConfig);
        } catch (error) {
            this.logger.log('Error loading configuration: ' + error);
            throw error;
        }
    }

    get servers() {
        return this._config.servers;
    }

    get core() {
        return this._config.core;
    }
}

module.exports = { Config };
