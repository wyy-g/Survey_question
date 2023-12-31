const express = require('express')

const API = require('./API')
const problemController = require('../controllers/problem')

const router = express.Router()

router.get(API.PROBLEMS.getAllProblems, problemController.getAllProblems)

module.exports = router