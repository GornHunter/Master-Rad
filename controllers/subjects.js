const Subject = require('../models/Subject')

const getAllSubjects = (req, res) => {
    res.json('get all subjects')
}

const createSubject = async (req, res) => {
    try{
        const subject = await Subject.create(req.body)
        res.status(201).json({subject})
    }catch(error){
        res.status(500).json({msg:error})
    }
}

const getSubject = (req, res) => {
    res.json('get single subject')
}

const updateSubject = (req, res) => {
    res.json('upodate subject')
}

const deleteSubject = (req, res) => {
    res.json('delete subject')
}

module.exports = {
    getAllSubjects,
    createSubject,
    getSubject,
    updateSubject,
    deleteSubject
}