const express = require('express')
const router = express.Router()

const API = require('./API.js')
const userController = require('../controllers/user.js')
const { verifyToken } = require('../utils/authorization.js')


router.post(API.USER.login, userController.userLogin)
router.post(API.USER.register, userController.userRegister)
router.use('/api/*', verifyToken)

module.exports = router