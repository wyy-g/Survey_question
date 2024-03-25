const {
    getFeedbackNotificationModal,
    delFeedbackNotificationModal,
    updateFeedbackNotificationModal,
    updateAllFeedbackNotificationBySurveyIdModal,
    delAllFeedbackNotificationBySurveyIdModal
} = require('../models/notification')

exports.getFeedbackNotifications = async (req, res) => {
    const usedId = req.params.id
    try {
        const data = await getFeedbackNotificationModal(Number(usedId))
        res.status(200).send({
            code: 200,
            msg: '',
            data
        })
    } catch (error) {
        console.log(err)
        res.status(500).send({
            code: 500,
            msg: '服务端内部错误'
        })
    }
}

exports.delFeedbackNotification = async (req, res) => {
    const notification_id = req.params.id
    try {
        const data = await delFeedbackNotificationModal(Number(notification_id))
        res.status(200).send({
            code: 200,
            msg: '删除成功',
        })
    } catch (error) {
        console.log(err)
        res.status(500).send({
            code: 500,
            msg: '服务端内部错误'
        })
    }
}

exports.updateFeedbackNotification = async (req, res) => {
    const notification_id = req.params.id
    try {
        await updateFeedbackNotificationModal(Number(notification_id))
        res.status(200).send({
            code: 200,
            msg: '更新成功',
        })
    } catch (error) {
        console.log(err)
        res.status(500).send({
            code: 500,
            msg: '服务端内部错误'
        })
    }
}

exports.updateAllFeedbackNotification = async (req, res) => {
    const user_id = req.params.id
    try {
        await updateAllFeedbackNotificationBySurveyIdModal(Number(user_id))
        res.status(200).send({
            code: 200,
            msg: '更新成功',
        })
    } catch (error) {
        console.log(err)
        res.status(500).send({
            code: 500,
            msg: '服务端内部错误'
        })
    }
}

exports.delAllFeedbackNotification = async (req, res) => {
    const user_id = req.params.id
    try {
        const data = await delAllFeedbackNotificationBySurveyIdModal(Number(user_id))
        res.status(200).send({
            code: 200,
            msg: '删除成功',
        })
    } catch (error) {
        console.log(err)
        res.status(500).send({
            code: 500,
            msg: '服务端内部错误'
        })
    }
}