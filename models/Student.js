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
    },
    index: {
        type: String,
        validate: {
            validator: function(v){
                return /\b[a-zA-Z][0-9]{1}[0-9]{1,3}-[0-9]{4}\b/.test(v)
            },
            message: index => `${index.value} is not a valid index`
        },
        required: [true, 'Index must be provided']
    }
})

module.exports = mongoose.model('Student', StudentSchema)