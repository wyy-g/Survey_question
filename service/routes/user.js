const express = require('express')
const router = express.Router()

const API = require('./API.js')
const userController = require('../controllers/user.js')
const { verifyToken } = require('../middlewares/authorization.js')

// 登录
router.post(API.USER.login, userController.userLogin)
// 注册
router.post(API.USER.register, userController.userRegister)
// token验证
//router.use('/api/*', verifyToken)
// 获取用户信息
router.get(API.USER.info, userController.getUserInfo)


module.exports = router