const Category = require('../models/Category')

const getAllCategories = (req ,res) => {
    res.json('get all categories')
}

const createCategory = (req ,res) => {
    res.json('create category')
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