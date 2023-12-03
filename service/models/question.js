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