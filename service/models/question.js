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