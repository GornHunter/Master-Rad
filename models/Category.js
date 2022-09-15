const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide category name'],
        trim: true
    },
    points: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Category', CategorySchema)