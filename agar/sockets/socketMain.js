// Where all our main socket stuff will go
const io = require('../servers').io
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions

// ===========Classes==============
const Orb = require('./classes/Orb')
const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");

let orbs = []
let players = []

let settings = {
    defaultOrbs: 5000,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000
}

initGame()

// isue a message to every client
setInterval(() => {
    if (players.length  > 0) {
        io.to('game').emit('tock', {
            players,
        })
    }
}, 33) // there are 30 33s in 1000 milliseconds


io.sockets.on('connect', (socket) => {
    let player = {}

    socket.on('init', (data) => {
        // add the player to the game namespace
        socket.join('game')
        // a player has connected
        // make a playerConfig object
        let playerConfig = new PlayerConfig(settings)
        // make a playerData object
        let playerData = new PlayerData(data.playerName, settings)
        // make a master player object to hold bot
        player = new Player(socket.id, playerConfig, playerData)

        console.log(player)

        // issue a message to this client with it's lock 30 per second
        setInterval(() => {
            console.log(player)
            socket.emit('tickTock', {
                players,
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            })
        }, 33) // there are 30 33s in 1000 milliseconds

        socket.emit('initReturn', {
            orbs,
        })
        players.push(playerData)
    })

    // the client sent over a tick. That means we know what direction to move the socket
    socket.on('tick', (data) => {
        const speed = player.playerConfig ?  player.playerConfig.speed : 0

        // console.log(player)
        // update the playerConfig object with the new direction in data
        // and at the same time creat a local variable for this callback for readability

        const xV = (data ? data.xVector : 0);
        const yV = data ? data.yVector : 0;

        // console.log(player)

        if (player.playerConfig){
            player.playerConfig.xVector = xV
            player.playerConfig.yVector = yV
        }

        if (player.playerData && player.playerConfig)  {
            if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
                player.playerData.locY -= speed * yV;
            }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
                player.playerData.locX += speed * xV;
            }else{
                player.playerData.locX += speed * xV;
                player.playerData.locY -= speed * yV;
            }

            let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
            capturedOrb.then((data) => {
                // emit to all sockets the orb to replace
                const orbData = {
                    orbIndex: data,
                    newOrb: orbs[data]
                }
                // every socket needs to know the leaderBoard has changed
                io.sockets.emit('updateLeaderBoard', getLeaderBoard())
                io.sockets.emit('orbSwitch', orbData)
            }).catch(() => {

            })
            let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId)
            playerDeath.then((data) => {
                io.sockets.emit('updateLeaderBoard',  getLeaderBoard())
                io.sockets.emit('playerDeath', data)
            }).catch(() => {

            })
        }
    })

    socket.on('disconnect', (data) => {
        players.forEach((currPlayer, i) => {
            if (currPlayer.uid == player.playerData.uid) {
                players.splice(i, 1)
            }
        })
    })
})

function getLeaderBoard() {
    // sort players in desc order
    players.sort((a,b) => {
        return b.score - a.score
    })
    let leaderBoard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    })
    return leaderBoard
}

// Run at the beginning of a new game
function initGame() {
    for (let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings))
    }
}

module.exports = io