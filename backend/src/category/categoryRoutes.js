const express = require ('express')
const { createCategory, deleteCategory, categoryList, findCatgoryList, updateCategory } = require('./categoryController')

const categoryRouter = express.Router()

categoryRouter.get('/categories', categoryList)
categoryRouter.get('/categories/:id', findCatgoryList)
categoryRouter.post('/category', createCategory)
categoryRouter.put('/category/:id', updateCategory)
categoryRouter.delete('/category/:id', deleteCategory)

module.exports = categoryRouter