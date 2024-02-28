const express = require('express')
const router = express.Router()

const API = require('./API.js')
const userController = require('../controllers/user.js')
const quesController = require('../controllers/question')
const { verifyToken } = require('../middlewares/authorization.js')
const userId = require('../middlewares/userId.js')

// 登录
router.post(API.USER.login, userController.userLogin)
// 注册
router.post(API.USER.register, userController.userRegister)
// 获取单个问卷的信息，不需要登录，因为答卷的时候不需要登录
// router.get(API.SURVEYS.getOneQues, quesController.getQuesInfo)

// token验证
router.use('/api/*', verifyToken)
// userID验证
router.use('/api/*', userId)
// 获取用户信息
router.get(API.USER.info, userController.getUserInfo)

module.exports = router