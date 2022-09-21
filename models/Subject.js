const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ime predmeta mora biti popunjeno'],
        trim: true
    },
    categories: [String]
})

module.exports = mongoose.model('Subject', SubjectSchema)