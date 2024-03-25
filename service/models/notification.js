const { executeQuery } = require('../db/index')

exports.addFeedbackNotificationModal = async ({ survey_id, user_id, message, is_read }) => {
    return executeQuery(
        `insert into feedbacknotifications (survey_id, user_id, message, is_read) values (?, ?, ?, ?)`,
        [survey_id, user_id, message, is_read]
    )
}

exports.getFeedbackNotificationModal = async (user_id) => {
    return executeQuery(
        `select * from feedbacknotifications where user_id = ? order by created_at DESC`,
        [user_id]
    )
}

exports.delFeedbackNotificationModal = async (notification_id) => {
    return executeQuery(
        `delete from feedbacknotifications where notification_id = ?`,
        [notification_id]
    )
}

exports.updateFeedbackNotificationModal = async (notification_id) => {
    return executeQuery(
        `update feedbacknotifications set is_read = 1 where notification_id = ?`,
        [notification_id]
    )
}

// 全部删除某一个问卷反馈建议
exports.delAllFeedbackNotificationBySurveyIdModal = async (surver_id) => {
    return executeQuery(
        `delete from feedbacknotifications where user_id = ?`,
        [surver_id]
    )
}

// 全部已读某一个问卷反馈建议
exports.updateAllFeedbackNotificationBySurveyIdModal = async (surver_id) => {
    return executeQuery(
        `update feedbacknotifications set is_read = 1 where user_id = ?`,
        [surver_id]
    )
}
