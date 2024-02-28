
const answerController = require('../controllers/answer')


// router.get(API.ANSWER.getSingleAnswers, answerController.getAllProblems)

const express = require('express')
const router = express()

const API = require('./API')
const quesComController = require('../controllers/questionCom')

router.get(API.ANSWER.getSingleAnswers, answerController.getAnswers)
router.delete(API.ANSWER.delAnswer, answerController.delAnswer)
router.get(API.ANSWER.downloadExcel, answerController.downloadExcel)
router.post(API.ANSWER.submitAnswer, answerController.submitAnswers)

module.exports = router