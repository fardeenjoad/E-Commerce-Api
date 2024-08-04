const express = require ('express')
const { createUser, getUser, getOneUser, loginUser, registerUser, getUserCount, deleteUser} = require('./userController')
const userRouter =express.Router()

userRouter.get('/users', getUser,)
userRouter.get('/users/:id', getOneUser)
userRouter.post('/users', createUser)
userRouter.post('/users/login', loginUser)
userRouter.post('/users/register', registerUser)
userRouter.get('/users/get/count', getUserCount)
userRouter.delete('/users/:id', deleteUser)


module.exports = userRouter
