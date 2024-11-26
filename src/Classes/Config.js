const fs = require('fs').promises;
const yaml = require('yaml');
const path = require('path');
const { Logger } = require('./Logger');
const configFilePath = path.join(__dirname, '../config.yaml');
const templateConfigFilePath = path.join(__dirname, '../config_template.yaml');

class Config {
    constructor() {
        this.logger = new Logger({ host: 'Server', port: '' });
    }

    async init() {
        try {
            if (await fs.readFile(templateConfigFilePath, 'utf8') && !process.argv[2] === '--no-config-warn') {
                this.logger.warn('U dumbass u forgot to rename the config file')
                return;
            }
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