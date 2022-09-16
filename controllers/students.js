const Student = require('../models/Student')
const Subject = require('../models/Subject')

const getAllStudents = async (req, res) => {
    try{
        const students = await Student.find({})
        res.status(200).json({students})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const createStudent = async (req, res) => {
    try{
        const student = await Student.create(req.body)
        res.status(201).json({student})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const getStudent = async (req, res) => {
    try{
        const {id:studentID} = req.params
        const student = await Student.findOne({_id: studentID})

        //const {firstName, lastName, index, subjects} = student
        //const subject = await Subject.findOne({_id: student.subjects[0].id})
        //const {name, categories} = subject

        if(!student){
            return res.status(404).json({msg: `No student with id: ${studentID}`})
        }
        
        //res.status(200).json(`{${student.firstName}, ${student.lastName}, ${student.index}, ${subject.name}, ${subject.categories[0]}, ${subject.categories[1]}, ${subject.categories[2]}, ${student.subjects[0].school_year}}`)
        res.status(200).json({student})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const updateStudent = async (req, res) => {
    try{
        const {id:studentID} = req.params
        const student = await Student.findOneAndUpdate({_id:studentID}, req.body, {
            new: true, 
            runValidators: true
        })

        if(!student){
            return res.status(404).json({msg: `No student with id: ${studentID}`})
        }

        res.status(200).json({id:studentID, data:req.body})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const deleteStudent = async (req, res) => {
    try{
        const {id:studentID} = req.params
        const student = await Student.findOneAndDelete({_id:studentID})

        if(!student){
            return res.status(404).json({msg: `No student with id: ${studentID}`})
        }

        res.status(200).json({student})
    }catch(error){
        res.status(500).json({msg: error})
    }
}


module.exports = {
    getAllStudents,
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent
}