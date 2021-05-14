const uuidv4 = require('uuid/v4')

// this is where all the data is that everyone needs to know about
class PlayerData {
    constructor(playerName, settings) {
        this.uid = uuidv4()
        this.name = playerName
        this.locX = Math.floor( 500)
        this.locY = Math.floor(500)
        this.radius = settings.defaultSize
        this.color = this.getRandomColor()
        this.score = 0
        this.orbsAbsorbed = 0
    }
    getRandomColor() {
        const r = Math.floor((Math.random() * 200) + 50)
        const g = Math.floor((Math.random() * 200) + 50)
        const b = Math.floor((Math.random() * 200) + 50)
        return `rgb(${r}, ${g}, ${b})`
    }
}

module.exports = PlayerData