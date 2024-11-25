const util = require('util');

class Logger {
    static colors = {
        reset: "\x1b[0m",
        magenta: "\x1b[35m", // DEBUG
        cyan: "\x1b[36m",    // LOG
        yellow: "\x1b[33m",  // WARN
        red: "\x1b[31m",     // ERROR
    };

    constructor(options) {
        this.options = options;
    }

    debug(...args) {
        this.logWithColor(Logger.colors.magenta, 'DEBUG', args);
    }

    log(...args) {
        this.logWithColor(Logger.colors.cyan, 'LOG', args);
    }

    warn(...args) {
        this.logWithColor(Logger.colors.yellow, 'WARN', args);
    }

    error(...args) {
        this.logWithColor(Logger.colors.red, 'ERROR', args);
    }

    parse(...args) {
        return JSON.stringify(args)
    }

    logWithColor(color, level, args) {
        const message = args.join(' ').replace(/§/g, '');
        process.stdout.write(`${color}[${this.options.host}:${this.options.port}]${Logger.colors.reset} ${message}\n`);
    }
}

module.exports = { Logger };