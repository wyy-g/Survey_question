const express = require('express')
const router = express()

const API = require('./API')
const quesController = require('../controllers/question')

// 创建问卷
router.post(API.SURVEYS.createQues, quesController.createQues)

// 获取某个用户的所有问卷列表
router.get(API.SURVEYS.questionList, quesController.getUserQuesList)

// 获取用户所有的标星问卷
router.get(API.SURVEYS.quesStar, quesController.getUserStar)

// 获取用户所有删除的问卷
router.get(API.SURVEYS.quesDel, quesController.getUserDel)

// 假删除问卷
router.put(API.SURVEYS.hiddenQues, quesController.hiddenQues)

// 标星与取消标星
router.put(API.SURVEYS.setQuesStarStatus, quesController.setStarStatus)

// 恢复问卷
router.put(API.SURVEYS.recoverQues, quesController.recoverQues)

//彻底删除问卷
router.delete(API.SURVEYS.deleteQues, quesController.delQues)

module.exports = router