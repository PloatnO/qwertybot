class Selfcare {
    constructor(client) {
        this.client = client
        this.init()
    }

    async init() {
        let permissionLevel = 2;
        let entityId;
        let gameMode;
    
        this.client.on("entity_status", (packet) => {
            if (!this.client.loggedIn) return;
            if (packet.entityId !== entityId || packet.entityStatus < 24 || packet.entityStatus > 28) return;
            permissionLevel = packet.entityStatus - 24;
        });
    
        this.client.on('game_state_change', (packet) => {
            if (this.client.loggedIn) this.client.loggedIn = false;
            if (!Number.isInteger(packet.gameMode)) return;
            this.client.gameMode = packet.gameMode;
            if (packet.gameMode !== 1) {
                this.client.chat('/minecraft:gamemode creative @s');
            }
        });
    
        this.client.on("login", (packet) => {
            entityId = packet.entityId;
            gameMode = packet.gameMode;
            this.client.loggedIn = true;
        });
    
        this.client.on('custom_systemChat', (packet, noColor, jsonMsg) => {
            if (!this.client.config.selfcare) return;
            
            const data = JSON.stringify(jsonMsg);
            // Mute selfcare //
    
            if ((data.includes('"text":"You have been muted!"') || data.includes('"text":"You have been muted for"')) && !data.toLowerCase().includes('now')) {
                this.client.core.run(`/mute ${this.client.username} 0s`);
            }
    
            // Prefix selfcare //
            if (!this.client.config.selfcare.prefix) return this.client.console.warn('No prefix set for selfcare');
    
            if (data === `"You no longer have a tag"`) {
                setTimeout(() => {
                    this.client.chat(`/prefix ${this.client.config.selfcare.prefix}`);
                }, 152);
            } else if (data.includes('You now have the tag:')) {
                if (data === `{"extra":["${this.client.config.selfcare.prefix}"],"text":"You now have the tag: "}`) {
                    return;
                } else {
                    setTimeout(() => {
                        this.client.chat(`/prefix ${this.client.config.selfcare.prefix}`);
                    }, 152);
                }
                
            }
    
            // Vanish Selfcare //
            if (data === `{"color":"gold","extra":[{"color":"red","text":"${this.client.username}"},{"":": disabled"}],"text":"Vanish for "}`) {
                this.client.chat(`/essentials:vanish on`);
            }
        });
    
        this.client.on('login', () => {
            setTimeout(()=>{
                setInterval(() => {
                    if (!this.client.loggedIn) return;
                    if (this.client.player && this.client.player.gameMode !== 1) {
                        this.client.chat('/minecraft:gamemode creative @s');
                    }
                    if (permissionLevel < 2) {
                        this.client.chat('/op @s[type=player]');
                    }
                }, 150);
            },1200)
        });
    }
}

module.exports = { Selfcare }