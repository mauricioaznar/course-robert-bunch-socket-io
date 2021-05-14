const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Machine = new Schema({
    macA: String,
    cpuLoad: Number,
    freemem: Number,
    totalmem: Number,
    usedmem: Number,
    memUsage: Number,
    osType: String,
    upTime: Number,
    cpuModel: String,
    numCores: Number,
    cpuSpeed: Number,

})

module.exports = mongoose.model('Machine', Machine)

/*
*         resolve({
            freemem,
            upTime,
            osType,
            totalmem,
            usedmem,
            memusage,
            cpuModel,
            cpuSpeed,
            numCores,
            cpuLoad,
        })
*
* */