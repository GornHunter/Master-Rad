const Category = require('../models/Category')

const getAllCategories = (req ,res) => {
    res.json('get all categories')
}

const createCategory = async (req ,res) => {
    try{
        const category = await Category.create(req.body)
        res.status(201).json({category})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const getCategory = (req ,res) => {
    res.json('get single category')
}

const updateCategory = (req ,res) => {
    res.json('update category')
}

const deleteCategory = (req ,res) => {
    res.json('delete category')
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}