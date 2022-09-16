const mongoose = require('mongoose')

const SubjectInfoSchema = new mongoose.Schema({
    id: {
        type: String
    },
    school_year: {
        type: String,
        required: [true, 'Must provide school year'],
        trim: true,
        validate: {
            validator: function(v){
                return /\b[0-9]{4}\/[0-9]{4}\b/.test(v)
            },
            message: year => `${year.value} is not a valid school year`
        }
    },
    points: [Number]
})

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
        required: [true, 'Index must be provided'],
        trim: true,
        validate: {
            validator: function(v){
                return /\b[a-zA-Z][0-9]{1}[0-9]{1,3}-[0-9]{4}\b/.test(v)
            },
            message: index => `${index.value} is not a valid index`
        }
    },
    subjects: [SubjectInfoSchema]
})

module.exports = mongoose.model('Student', StudentSchema)