const express = require('express')
const app = express()
const socketio = require('socket.io')
let namespaces = require('./data/namespaces')
app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(9000)
const io = socketio(expressServer)

io.on('connection', (socket) => {
    // console.log(socket.handshake)
    // build an array to send back with the img and endpoint for each ns
    let nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log(nsData)
    // send the nsData back to the client. we need to use socket, not io, because we want it
    // to go to the client
    socket.emit('nsList', nsData)
})

namespaces.forEach((namespace) => {
    io
        .of(namespace.endpoint)
        .on('connection', (nsSocket) => {
            const username = nsSocket.handshake.query.username
            // console.log(`${nsSocket.id} has join ${namespace.endpoint}`)
            // a socket has connected to one of our chatgroup namespaces
            // send that ns group info back

            nsSocket.emit('nsRoomLoad', namespace.rooms)
            nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
                // deal with history... once we have it
                const roomToLeave = Object.keys(nsSocket.rooms)[1]
                nsSocket.leave(roomToLeave)
                updateUsersInRoom(namespace, roomToLeave)
                nsSocket.join(roomToJoin)
                // io.of('/wiki').in(roomToJoin).clients((err, clients) => {
                //     numberOfUsersCallback(clients.length)
                // })
                const nsRoom = namespace.rooms.find((room) => {
                    return room.roomTitle === roomToJoin
                })
                nsSocket.emit('historyCatchUp', nsRoom.history)
                // send back the number of users in this room toALL sockets
                updateUsersInRoom(namespace, roomToJoin)
            })
            nsSocket.on('newMessageToServer', (msg) => {
                const fullMsg = {
                    text: msg.text,
                    time: Date.now(),
                    username: username,
                    avatar: 'https://via.placeholder.com/30'
                }
                // send this message to all the sockets that are in the room that this socket is in
                const roomTitle = Object.keys(nsSocket.rooms)[1]
                // we need to find the Room object for this room
                const nsRoom = namespace.rooms.find((room) => {
                    return room.roomTitle === roomTitle
                })
                // console.log(nsRoom)
                // console.log(roomTitle)
                nsRoom.addMessage(fullMsg)
                io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
            })
        })
})

function updateUsersInRoom (namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
    })
}