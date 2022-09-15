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

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide subject name'],
        trim: true
    },
    category: [
        CategorySchema
    ]
})

module.exports = mongoose.model('Subject', SubjectSchema)