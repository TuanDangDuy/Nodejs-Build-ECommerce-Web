const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Product', ProductSchema)