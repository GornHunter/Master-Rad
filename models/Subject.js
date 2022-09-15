const mongoose = require('mongoose')


const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide subject name'],
        trim: true
    },
    category: {
        type: Array
    }
})

module.exports = mongoose.model('Subject', SubjectSchema)