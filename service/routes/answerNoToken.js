
const answerController = require('../controllers/answer')


// router.get(API.ANSWER.getSingleAnswers, answerController.getAllProblems)

const express = require('express')
const router = express()

const API = require('./API')
const quesComController = require('../controllers/questionCom')

// router.get(API.ANSWER.getSingleAnswers, answerController.getAnswers)

module.exports = router