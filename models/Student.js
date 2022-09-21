const mongoose = require('mongoose')

const SubjectInfoSchema = new mongoose.Schema({
    id: {
        type: String
    },
    school_year: {
        type: String,
        required: [true, 'Skolska godina mora biti popunjena'],
        trim: true,
        validate: {
            validator: function(v){
                return /\b[0-9]{4}\/[0-9]{4}\b/.test(v)
            },
            message: year => `${year.value} nije validan format za skolsku godinu`
        }
    },
    points: [Number]
})

const StudentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Ime mora biti popunjeno'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Prezime mora biti popunjeno'],
        trim: true
    },
    index: {
        type: String,
        required: [true, 'Indeks mora biti popunjen'],
        trim: true,
        validate: {
            validator: function(v){
                return /\b[a-zA-Z]+[0-9]{1}[\s]?[0-9]{1,3}-[0-9]{4}\b/.test(v)
            },
            message: index => `${index.value} nije validan format za indeks`
        }
    },
    subjects: [SubjectInfoSchema]
})

module.exports = mongoose.model('Student', StudentSchema)