const Category = require('../models/Category')

const getAllCategories = async (req ,res) => {
    try{
        const categories = await Category.find({})
        res.status(200).json({categories})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const createCategory = async (req ,res) => {
    try{
        const category = await Category.create(req.body)
        res.status(201).json({category})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const getCategory = async (req ,res) => {
    try{
        const {id:categoryID} = req.params
        const category = await Category.findOne({_id: categoryID})

        if(!category){
            return res.status(404).json({msg: `No category with id: ${categoryID}`})
        }

        res.status(200).json({category})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const updateCategory = async (req ,res) => {
    try{
        const {id:categoryID} = req.params
        const category = await Category.findOneAndUpdate({_id:categoryID}, req.body, {
            new: true, 
            runValidators: true
        })

        if(!category){
            return res.status(404).json({msg: `No category with id: ${categoryID}`})
        }

        res.status(200).json({id:categoryID, data:req.body})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const deleteCategory = async (req ,res) => {
    try{
        const {id:categoryID} = req.params
        const category = await Category.findOneAndDelete({_id:categoryID})

        if(!category){
            return res.status(404).json({msg: `No category with id: ${categoryID}`})
        }

        res.status(200).json({category})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}