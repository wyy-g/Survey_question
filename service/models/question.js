const { executeQuery } = require('../db/index')

exports.createOneQues = async (title, description, isPublished, isStar, isDeleted, userId) => {
    console.log(isStar)
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `INSERT INTO Surveys (title, description, isPublished, isStar, isDeleted, userId)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [title, description, isPublished, isStar, isDeleted, userId]
    )
}

exports.getUserAllQues = async (userId) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `select * from surveys where userId=?`,
        [userId]
    )
}

exports.getUserStarQues = async (userId, isStar) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isStar !== true) throw Error('isStar not true')
    return await executeQuery(
        `select * from surveys where userId=? and isStar=?`,
        [userId, isStar]
    )
}

exports.getUserDelQues = async (userId, isDeleted) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isDeleted !== true) throw Error('isDeleted not true')
    return await executeQuery(
        `select * from surveys where userId=? and isDeleted=?`,
        [userId, isDeleted]
    )
}

exports.hidQuse = async (userId, quesId) => {
    if (typeof userId !== 'number' || typeof quesId !== 'number') throw Error('userId or quesId not number')
    return await executeQuery(
        `UPDATE surveys SET isDeleted = TRUE
        WHERE userId = ? AND id = ?;`,
        [userId, quesId]
    )
}

exports.setStarStatusModel = async (userId, quesId, isStar) => {
    if (typeof userId !== 'number' || typeof quesId !== 'number') throw Error('userId or quesId not number')
    return await executeQuery(
        `update surveys set isStar = ? where userId = ? and id = ?`,
        [isStar, userId, quesId]
    )
}

exports.recoverQuesModel = async (quesId) => {
    if (typeof quesId !== 'number') throw Error('quesId not number')
    return await executeQuery(
        `UPDATE surveys SET isDeleted = FALSE
        WHERE  id = ?;`,
        [quesId]
    )
}

exports.delQuesModel = async (quesId) => {
    if (typeof quesId !== 'number') throw Error('quesId not number')
    return await executeQuery(
        `delete from surveys WHERE  id = ?;`,
        [quesId]
    )
}