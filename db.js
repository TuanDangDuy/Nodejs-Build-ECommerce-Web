const mongoose = require('mongoose')

const connectionDb = mongoose.connect(process.env.CONNECTION_STRING)

module.exports = connectionDb