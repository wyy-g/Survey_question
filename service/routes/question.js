const express = require('express')
const router = express()

const API = require('./API')
const quesController = require('../controllers/question')
const aiQuesController = require('../controllers/aiQuestion')

// 分页中间件
const pagination = require('../middlewares/pagenition')

// 创建问卷
router.post(API.SURVEYS.createQues, quesController.createQues)

// 获取某个用户的所有问卷列表
router.get(API.SURVEYS.questionList, pagination, quesController.getUserQuesList)

// 获取用户所有的标星问卷
router.get(API.SURVEYS.quesStar, pagination, quesController.getUserStar)

// 获取用户所有删除的问卷
router.get(API.SURVEYS.quesDel, pagination, quesController.getUserDel)

// 假删除问卷
router.put(API.SURVEYS.hiddenQues, quesController.hiddenQues)

// 标星与取消标星
router.put(API.SURVEYS.setQuesStarStatus, quesController.setStarStatus)

// 恢复问卷
router.put(API.SURVEYS.recoverQues, quesController.recoverQues)

//彻底删除问卷
router.delete(API.SURVEYS.deleteQues, quesController.delQues)

// 搜索问卷
router.get(API.SURVEYS.searchQues, pagination, quesController.searchQues)

// 问卷的排序
router.get(API.SURVEYS.sortQues, pagination, quesController.sortQues)

// 获取某个问卷的详细信息
router.get(API.SURVEYS.getOneQues, quesController.getQuesInfo)

// 更新问卷信息
router.patch(API.SURVEYS.updateQues, quesController.updateQues)

// 复制某个问卷
router.post(API.SURVEYS.copyQues, quesController.copyQues)

// AI智能生成问卷
router.post(API.AI, aiQuesController.generateSurvey)

// 创建AI生成的问卷
router.post(API.CREATEDQUESBYAI, aiQuesController.createdAiGenQues)

// 翻译问卷
router.post(API.SURVEYS.translateQues, quesController.getTranslateText)

module.exports = router