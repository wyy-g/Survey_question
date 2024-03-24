const { executeQuery } = require('../db/index')

exports.isHaveUser = async (userId) => {
    if (!userId) throw Error('userId not null')
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `select * from users where id=?;`, [userId]
    )
}

exports.isHaveQues = async (quesId) => {
    if (!quesId) throw Error('quesId not null')
    if (typeof quesId !== 'number') throw Error('quesId not number')
    return await executeQuery(
        `select * from surveys where id=?;`, [quesId]
    )
}

exports.getUserIdBySurveyId = async (survey_id) => {
    return await executeQuery(
        `select * from surveys where id=?;`, [survey_id]
    )
}