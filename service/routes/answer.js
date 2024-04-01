
const answerController = require('../controllers/answer')


// router.get(API.ANSWER.getSingleAnswers, answerController.getAllProblems)

const express = require('express')
const router = express()
const upload = require('../middlewares/upload')


const API = require('./API')
const quesComController = require('../controllers/questionCom')

router.get(API.ANSWER.getSingleAnswers, answerController.getAnswers)
router.delete(API.ANSWER.delAnswer, answerController.delAnswer)
router.get(API.ANSWER.downloadExcel, answerController.downloadExcel)
router.post(API.ANSWER.submitAnswer, answerController.submitAnswers)
router.post(API.ANSWER.feedback, answerController.addFeedback)
router.get(API.ANSWER.feedback, answerController.getFeedback)
router.delete(API.ANSWER.feedback, answerController.delFeedback)
router.post(API.ANSWER.uploadFile, upload.single('uploadAnswersFile'), answerController.uploadAnswerUpload)

module.exports = router