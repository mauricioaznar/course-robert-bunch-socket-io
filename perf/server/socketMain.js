const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://maguas:maurisio01@emaily-cluster.dro2u.mongodb.net/perfData?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Machine = require('./models/Machine')
// mongodb+srv://maguas:<password>@emaily-cluster.dro2u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// entrypoint from our cluster which will make workes and the workers
// will do the socket.io handling

function socketMain (io, socket) {
    let macA;
    // console.log("Someone called me! i'm socket main", socket.id)
    socket.on('clientAuth', (key) => {
        if (key === '23423') {
            // valid nodeClient
            socket.join('clients')
        } else if (key === 'asdfasd'){
            //valid ui client has joined
            socket.join('ui')
        } else {
            socket.disconnect(true)
        }
    })

    // a machine has connected, check to see if it's new
    // if it is, add it!.
    socket.on('initPerfData', async (data) => {
        // console.log(data)
        // update our socket connect function scoped variable
        macA = data.macA
        // now go check mongo!
        const mongooseResponse = await checkAndAdd(data)
        console.log(mongooseResponse)
    })

    socket.on('perfData', (data) => {
        // console.log(data)
    })
}

function checkAndAdd(data) {
    // because we are doing db stuff, js wont wait for the db
    // so we need to make this a promise
    return new Promise((resolve, reject) => {
        Machine.findOne(
            { macA: data.macA },
            (err, doc) => {
                if (err) {
                    throw err;
                    reject(err)
                } else if (doc === null) {
                    // the record is not in the db, so add it
                    let machine = new Machine(data)
                    machine.save()
                    resolve('added')
                } else {
                    resolve('found')
                }
            }
        )
    })
}

module.exports = socketMain