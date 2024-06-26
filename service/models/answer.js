const { executeQuery } = require('../db/index')

exports.getSubmissionModel = (surverId, start_time, end_time) => {
    if (start_time && end_time) {
        return executeQuery(
            `SELECT * FROM submissions WHERE survey_id = ? AND submit_time BETWEEN ? AND ?`,
            [surverId, start_time, end_time]
        )
    } else {
        return executeQuery(
            `SELECT * FROM submissions WHERE survey_id = ?`,
            [surverId]
        )
    }
}

exports.getAnswersBySubmissionId = async (submissionId) => {
    return executeQuery(
        `
        SELECT a.*
        FROM answers a
        JOIN submissions s ON a.submission_id = s.submission_id
        WHERE s.submission_id = ?
        `,
        [submissionId]
    )
}

exports.delAnswersModel = async (submissionId) => {
    return executeQuery(
        `DELETE FROM answers WHERE submission_id = ?`,
        [submissionId]
    )
}

exports.delSubmissionsModel = async (submissionId) => {
    return executeQuery(
        `DELETE FROM submissions WHERE submission_id = ?`,
        [submissionId]
    )
}

exports.addSubmissionModel = async ({ device_info, browser_info, ip_address, startTime, survey_id }) => {
    return executeQuery(
        `INSERT INTO submissions (device_info, browser_info, ip_address, start_time, survey_id) VALUES (?, ?, ?, ?, ?)`,
        [device_info, browser_info, ip_address, startTime, survey_id]
    )
}

exports.addAnswersModel = async ({ submission_id, component_instance_id, question_type, answer_value }) => {
    return executeQuery(
        `INSERT INTO answers (submission_id, component_instance_id, question_type, answer_value) VALUES (?, ?, ?, ?)`,
        [submission_id, component_instance_id, question_type, answer_value]
    )
}

exports.addFeedbackMOdel = async ({ survey_id, username, email, comment }) => {
    if (!username) username = ''
    if (!email) email = ''
    return executeQuery(
        `INSERT INTO survey_feedback (survey_id, username, email, comment) VALUES (?,?,?,?)`,
        [survey_id, username, email, comment]
    )
}

exports.getFeedbackModel = async (survey_id) => {
    return executeQuery(
        `select * from survey_feedback where survey_id = ?`,
        [survey_id]
    )
}

exports.delFeedbackModel = async (feedback_id) => {
    return executeQuery(
        `delete from survey_feedback where feedback_id = ?`,
        [
            feedback_id
        ]
    )
}

// 答案是图片把需要上传到数据库
exports.uploadFileModel = async ({ storage_address, filetype, survey_id }) => {
    return executeQuery(
        `insert into uploadedfiles (storage_address, filetype, survey_id) values (?,?,?)`,
        [storage_address, filetype, survey_id]
    )
}

exports.updateFileStatusModel = async (url) => {
    return executeQuery(
        `update uploadedfiles set submit_status = true where storage_address = ?`,
        [url]
    )
}

exports.delFilesModel = async () => {
    return executeQuery(
        `delete from uploadedfiles where submit_status = false`
    )
}