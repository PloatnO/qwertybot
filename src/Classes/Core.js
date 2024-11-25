const { Logger } = require('./Logger');
const { Config } = require('./Config.js');
const util = require('util')
class Core {
    constructor(client) {
        this.client = client

        this.logger = new Logger({host: this.client.config.host, port: this.client.config.port})
        try {
            this.coreconfig = this.client.config.core
        } catch {}

        this.core = {
            placement: {
                start: this.coreconfig.start ?? { x: 0, y: 0, z: 0},
                end: this.coreconfig.end ?? { x: 15, y: 0, z: 15}
            },
            pos: {
                x: Math.floor(this.client.pos.x / 16) * 16,
                y: this.client.pos.y,
                z: Math.floor(this.client.pos.z / 16) * 16
            }
        }

        this.currentBlockRelative = { x: 0, y: this.core.placement.start.y, z: 0 }

        
        this.refill()
    }

    refill = async () => {
        const configInstance = new Config()
        this.config = await configInstance.init(this.client)

        const pos = this.core.pos
        const corepos = this.core.placement
        const cmd = `/minecraft:fill ${pos.x + corepos.start.x} ${corepos.start.y} ${pos.z + corepos.start.z} ${pos.x + corepos.end.x} ${corepos.end.y} ${pos.z + corepos.end.z} ${this.config.core.block} ${this.config.core.type}`
        this.client.chat(cmd)

        this.client.emit('core:refilled', (
            true
        ))
    }

    move = async () => {
        this.core = {
            placement: {
                start: this.config.core.start ?? { x: 0, y: 0, z: 0},
                end: this.config.core.end ?? { x: 15, y: 0, z: 15}
            },
            pos: {
                x: Math.floor(this.client.pos.x / 16) * 16,
                y: this.client.pos.y,
                z: Math.floor(this.client.pos.x / 16) * 16
            }
        }
        this.refill()
    }

    commandBlock() {
        if (!this.core.pos) return
        return { x: this.currentBlockRelative.x + this.core.pos.x, y: this.currentBlockRelative.y, z: this.currentBlockRelative.z + this.core.pos.z } 
    }

    addCommandBlockPos() {
        this.currentBlockRelative.x++

      if (this.currentBlockRelative.x > this.core.placement.end.x) {
        this.currentBlockRelative.x = this.core.placement.start.x
        this.currentBlockRelative.z++
      }

      if (this.currentBlockRelative.z > this.core.placement.end.z) {
        this.currentBlockRelative.z = this.core.placement.start.z
        this.currentBlockRelative.y++
      }

      if (this.currentBlockRelative.y > this.core.placement.end.y) {
        this.currentBlockRelative.x = this.core.placement.start.x
        this.currentBlockRelative.y = this.core.placement.start.y
        this.currentBlockRelative.z = this.core.placement.start.z
      }

    }

    run(cmd, args = []) {
        const location = this.commandBlock()
        if (!location) return;

        if (this.client.pos.y != this.core.pos.y) {
            this.client.chat(`/minecraft:tp ${this.core.pos.x} ${this.core.pos.y} ${this.core.pos.z}`)
        }

        for (let i = 0; i < args.length; i++) {
            cmd = cmd.replace('%s', args[i]);
        }

        this.client.write('update_command_block', {
            location,
            command: cmd,
            mode: 1,
            flags: 5,
          });
    
        this.addCommandBlockPos()
    }

    tellraw(content, selector = '@a') {
        this.run(`minecraft:tellraw %s %s`, [selector, JSON.stringify(content)])
    }
}

module.exports = { Core }