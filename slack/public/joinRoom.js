function joinRoom(roomName) {
    // send this room name to the server
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        // we want to update the room member total now that we have jointed
        console.log(newNumberOfMembers)
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers}`
    })
    nsSocket.on('historyCatchUp', (roomHistory) => {
        const messagesUl = document.querySelector('#messages')
        messagesUl.innerHTML = ''
        roomHistory.forEach((msg) => {
            const newMsg = buildHTML(msg)
            const currentMessages = messagesUl.innerHTML
            messagesUl.innerHTML = currentMessages + newMsg
        })
        messagesUl.scrollTo(0, messagesUl.scrollHeight)
    })

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}`
        document.querySelector('.curr-room-text').innerHTML = `${roomName}`
    })
    let searchBox = document.querySelector('#search-box')
    searchBox.addEventListener('input', (e) => {{
        console.log(e.target.value)
        let messages = Array.from(document.getElementsByClassName('.message-text'))
        console.log(messages)
        messages.forEach((msg) => {
            if (msg.innerText.indexOf(e.target.value) === -1) {
                msg.style.display = 'none'
            } else {
                msg.style.display = 'block'
            }
        })
    }})
}