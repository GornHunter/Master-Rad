const mongoose = require('mongoose')


const StudentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Must provide first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Must provide last name'],
        trim: true
    }
})

module.exports = mongoose.model('Student', StudentSchema)