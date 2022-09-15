const Subject = require('../models/Subject')

const getAllSubjects = async (req, res) => {
    try{
        const subjects = await Subject.find({})
        res.status(200).json({subjects})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const createSubject = async (req, res) => {
    try{
        const subject = await Subject.create(req.body)
        res.status(201).json({subject})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const getSubject = async (req, res) => {
    try{
        const {id:subjectID} = req.params
        const subject = await Subject.findOne({_id: subjectID})

        if(!subject){
            return res.status(404).json({msg: `No subject with id: ${subjectID}`})
        }

        res.status(200).json({subject})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const updateSubject = async (req, res) => {
    try{
        const {id:subjectID} = req.params
        const subject = await Subject.findOneAndUpdate({_id:subjectID}, req.body, {
            new: true, 
            runValidators: true
        })

        if(!subject){
            return res.status(404).json({msg: `No subject with id: ${subjectID}`})
        }

        res.status(200).json({id:subjectID, data:req.body})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const deleteSubject = async (req, res) => {
    try{
        const {id:subjectID} = req.params
        const subject = await Subject.findOneAndDelete({_id:subjectID})

        if(!subject){
            return res.status(404).json({msg: `No subject with id: ${subjectID}`})
        }

        res.status(200).json({subject})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

module.exports = {
    getAllSubjects,
    createSubject,
    getSubject,
    updateSubject,
    deleteSubject
}