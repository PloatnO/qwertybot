class Position {
    constructor(client) {
        this.client = client
        this.init()
    }

    init = () => {
        this.client.on('position',(packet)=>{
            this.client.pos = packet
            this.client.write('teleport_confirm',{
                teleportId: this.client.pos.teleportId
            })
        })
    }
}

module.exports = { Position }