function inject(client) {
    client.tab_complete = (str) => {
        return new Promise((resolve) => {
            client.write('tab_complete', {
                text: str,
                assumeCommand: false,
                sendBlockInSight: false
            })
        
            const tab_completeH = (packet) => {
                client.removeListener('tab_complete', tab_completeH)
                resolve(packet.matches)
            }
        
            client.once('tab_complete', tab_completeH)
        })
    }
}

module.exports = { inject };