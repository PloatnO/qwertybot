/**
 * @name Plugin - Players
 * @author aaa | https://discord.gg/t3MFQPdA5g
 * 
 * This is a plugin for getting players.
 * 
 */

function inject(client) {
    client.players = []

    function decompNBT(nbt) {
        return nbt  
    }

    client.on('player_info', async (packet) => {
        switch(packet.action) {
            case 63: // player_info.addPlayers
                {
                    for(const plr of packet.data) {
                        //const ipMsg = await client.core.placeTracked(`seen ${plr.uuid}`)

                        client.players[plr.name || plr.NAME || plr.player.name] = {
                            name: plr.player.name || plr.name,
                            uuid: plr.uuid || plr.UUID,
                            op: true, // OP
                            gamemode: plr.gamemode, // Survival
                            ping: plr.latency,
                            rawDisplay: decompNBT(plr.displayName) || plr.name,
                            essentials: {
                                vanished: false,
                                muted: false, // /whois <user> - Command block response: Muted: bool
                                nick: "",
                                //ip: ""
                            },
                            extras: {
                                prefix: ""
                            },
                            rawData: plr
                        }

                        try {
                            //client.players[plr.uuid].essentials.ip = ipMsg?.extra[0]?.extra[1]?.text?.trim()
                        }catch{}
                    }
                }
                break
            case 16: // player_info.updatePing
                {
                    const _plr = packet.data[0]

                    try {
                        client.players[_plr.uuid || _plr.UUID].ping = _plr.latency
                    } catch {}
                }
                break
            case 32: // player_info.updateDisplay
                {
                    const _plr = packet.data[0]

                    try {
                        client.players[_plr.uuid || _plr.UUID].rawDisplay = decompNBT(_plr.displayName)
                    } catch {}
                }
                break
            case 4: // player_info.updateGamemode
                {
                    const _plr = packet.data[0]

                    try {
                        client.players[_plr.uuid || _plr.UUID].gamemode = _plr.gamemode
                    } catch {}
                }
                break
        }
    })

    client.on('player_remove', async ({players}) => { // this is in FNFBoyfriendclient, but look at the commits - i commited it, so it's technically our <3 -aaa
        let player_completion = (await client.tab_complete('scoreboard players add ')).filter(_ => _.tooltip == undefined) // exclude @a, @r, @s, @e, @p -aaa
    
        client.players.forEach(async player => {
            if(!players.includes(player.uuid)) return
    
            const a = player_completion.filter(_ => _.match == player.profile.name)
    
            if(a.length >= 1) {
                player.essentials.vanished = true
            } else {
                client.rawplayers = client.rawplayers.filter(_ => _.uuid != player.uuid)
                client.players = client.players.filter(_ => _.uuid != player.uuid)
                
            }
        })
    })
}

module.exports = { inject };