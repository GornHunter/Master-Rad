const Student = require('../models/Student')

const getAllStudents = (req, res) => {
    res.send('get all students')
}

const createStudent = async (req, res) => {
    try{
        const student = await Student.create(req.body)
        res.status(201).json({student})
    }catch(error){
        res.status(500).json({msg: error})
    }
}


module.exports = {
    getAllStudents,
    createStudent
}