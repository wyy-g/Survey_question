const { executeQuery } = require('../db/index')

exports.createOneQues = async (title, description, isPublished, isStar, isDeleted, userId) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `INSERT INTO Surveys (title, description, isPublished, isStar, isDeleted, userId)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [title, description, isPublished, isStar, isDeleted, userId]
    )
}

exports.getUserAllQues = async (userId, offset, pageSize) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `select * from surveys where userId=? limit ?, ?`,
        [userId, offset, pageSize]
    )
}

exports.getUserStarQues = async (userId, isStar, offset, pageSize) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isStar !== true) throw Error('isStar not true')
    return await executeQuery(
        `select * from surveys where userId=? and isStar=? limit ?, ?`,
        [userId, isStar, offset, pageSize]
    )
}

exports.getUserDelQues = async (userId, isDeleted, offset, pageSize) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isDeleted !== true) throw Error('isDeleted not true')
    return await executeQuery(
        `select * from surveys where userId=? and isDeleted=? limit ?, ?`,
        [userId, isDeleted, offset, pageSize]
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

exports.searchQuesModel = async (userId, keyword, isStar, isDeleted, offset, pageSize) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isDeleted != true) isDeleted = false
    if (isStar != true) isStar = false

    const searchKeyword = `%${keyword}%`

    switch (true) {
        case isStar:
            return await executeQuery(
                'select * from surveys where userId=? and isStar = ? and title like ? limit ?, ?',
                [userId, isStar, searchKeyword, offset, pageSize]
            )
        case isDeleted:
            return await executeQuery(
                'select * from surveys where userId=? and isDeleted = ? and title like ? limit ?, ?',
                [userId, isDeleted, searchKeyword, offset, pageSize]
            )
        default:
            return await executeQuery(
                'select * from surveys where userId=? and title like ? limit ?, ?',
                [userId, searchKeyword, offset, pageSize]
            )
    }
}

// 问卷排序
exports.sortQuesModel = async (userId, sort, order, offset, pageSize) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (sort == null || sort == '' || sort == 0) sort = 'createAt'
    if (order == null || order == '' || order == 0) order = 'desc'


    switch (order) {
        case 'desc':
            return await executeQuery(
                'select * from surveys where userId = ? and isDeleted = false order by ? desc limit ?, ?',
                [userId, sort, offset, pageSize]
            )
        case 'asc':
            return await executeQuery(
                'select * from surveys where userId = ? and isDeleted = false order by ? asc limit ?, ?',
                [userId, sort, offset, pageSize]
            )
    }
}