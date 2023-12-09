const express = require('express')
const router = express()

const API = require('./API')
const quesComController = require('../controllers/questionCom')

router.get(API.QUES_COM.getAllQuesCom, quesComController.getAllQuesCom)

module.exports = router