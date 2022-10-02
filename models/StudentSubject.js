const mongoose = require('mongoose')

const StuentSubjectSchema = new mongoose.Schema({
    student_id: {
        type: String
    },
    subject_id: {
        type: String,
        required: [true, 'Predmet mora biti odabran']
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

module.exports = mongoose.model('StudentSubject', StuentSubjectSchema)