const express = require('express')
const router = express.Router()

const API = require('./API.js')
const userController = require('../controllers/user.js')
const quesController = require('../controllers/question')
const { verifyToken } = require('../middlewares/authorization.js')
const userId = require('../middlewares/userId.js')
const upload = require('../middlewares/upload')
const emailCodeController = require('../controllers/emailCode.js')

// 登录
router.post(API.USER.login, userController.userLogin)
// 注册
router.post(API.USER.register, userController.userRegister)
// 获取单个问卷的信息，不需要登录，因为答卷的时候不需要登录
// router.get(API.SURVEYS.getOneQues, quesController.getQuesInfo)
// 修改密码
router.post(API.USER.updateUserPassword, userController.updateUserPasswordService)

// token验证
router.use('/api/*', verifyToken)
// userID验证
router.use('/api/*', userId)
// 获取用户信息
router.get(API.USER.info, userController.getUserInfo)
// 上传用户头像
router.post(API.UPLOADIMG, upload.single('imgFile'), userController.uploadImg)

// 绑定邮箱发送验证码
router.post(API.SENDEMAILCODE, emailCodeController.sendMailCode)

// 验证验证码是否正确
router.post(API.VERIFSUBMITYCODE, emailCodeController.verifySubmitEmailAndCode)

// 更新用户的头像和绑定邮箱
router.post(API.USER.updateUserInfo, userController.updateUserInfo)

module.exports = router