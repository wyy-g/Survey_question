const express = require('express')
const router = express()

const API = require('./API')

const notificationController = require('../controllers/notification')

router.get(API.FEEDBACKNOTIFICARION, notificationController.getFeedbackNotifications)
router.delete(API.FEEDBACKNOTIFICARION, notificationController.delFeedbackNotification)
router.patch(API.FEEDBACKNOTIFICARION, notificationController.updateFeedbackNotification)

module.exports = router