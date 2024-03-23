const { executeQuery } = require('../db/index')

exports.createOneQues = async (title, description, isPublished, isStar, isDeleted, userId) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `INSERT INTO surveys (title, description, isPublished, isStar, isDeleted, userId)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [title, description, isPublished, isStar, isDeleted, userId]
    )
}

// 获取问卷列表（分页）
exports.getUserAllQues = async (userId, offset, pageSize, isPublished) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isPublished == 'allQues') {
        return await executeQuery(
            `select * from surveys where userId=? and isDeleted = 0 limit ?, ?`,
            [userId, offset, pageSize]
        )
    } else if (isPublished == 'true') {
        return await executeQuery(
            `select * from surveys where userId=? and isDeleted = 0 and isPublished = 1 limit ?, ?`,
            [userId, offset, pageSize]
        )
    } else if (isPublished == 'false') {
        return await executeQuery(
            `select * from surveys where userId=? and isDeleted = 0 and isPublished = 0 limit ?, ?`,
            [userId, offset, pageSize]
        )
    }

}
// 获取问卷列表的总条数或者标星问卷的总条数，或者回收站的总条数
exports.getQuesTotal = async (userId, isStar, isDeleted) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isDeleted != true) isDeleted = false
    if (isStar != true) isStar = false
    switch (true) {
        case isStar:
            return await executeQuery(
                `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isStar = 1`,
                [userId]
            )
        case isDeleted:
            return await executeQuery(
                `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 1`,
                [userId]
            )
        default:
            return await executeQuery(
                `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0`,
                [userId]
            )
    }

}
// 获取搜索问卷列表的总条数或者标星问卷的总条数，或者回收站的总条数
exports.getSearchQuesTotal = async (userId, isStar, isDeleted, isPublished, keyword) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isDeleted != true) isDeleted = false
    if (isStar != true) isStar = false
    const searchKeyword = `%${keyword}%`
    switch (true) {
        case isStar:
            return await executeQuery(
                `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isStar = 1 and title like ?`,
                [userId, searchKeyword]
            )
        case isDeleted:
            return await executeQuery(
                `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 1  and title like ?`,
                [userId, searchKeyword]
            )
        default:
            if (isPublished === 'allQues') {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0  and title like ?`,
                    [userId, searchKeyword]
                )
            } else if (isPublished === 'true') {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isPublished = 1  and title like ?`,
                    [userId, searchKeyword]
                )
            } else if (isPublished === 'false') {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isPublished = 0  and title like ?`,
                    [userId, searchKeyword]
                )
            }

    }

}

// 获取未发布和已发布的数据总条数
exports.getPublishedQuesTotal = async (userId, isStar, isPublished, keyword) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isStar != true) isStar = false
    const searchKeyword = `%${keyword}%`
    switch (isPublished) {
        case true:
            if (isStar) {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isStar = 1 and isPublished = 1 and title like ?`,
                    [userId, searchKeyword]
                )
            } else {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isPublished = 1 and title like ?`,
                    [userId, searchKeyword]
                )
            }

        case false:
            if (isStar) {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isStar = 1 and isPublished = 0 and title like ?`,
                    [userId, searchKeyword]
                )
            } else {
                return await executeQuery(
                    `SELECT COUNT(*) AS total FROM surveys WHERE userId=? and isDeleted = 0 and isPublished = 0 and title like ?`,
                    [userId, searchKeyword]
                )
            }
    }

}

exports.getUserStarQues = async (userId, isStar, offset, pageSize) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    if (isStar !== true) throw Error('isStar not true')
    return await executeQuery(
        `select * from surveys where userId=? and isStar=? and isDeleted = 0 limit ?, ?`,
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

// 获取搜索后的数据
exports.searchQuesModel = async (userId, keyword, isStar, isDeleted, isPublished, offset, pageSize) => {
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
            if (isPublished === 'allQues') {
                return await executeQuery(
                    'select * from surveys where userId=? and isDeleted = 0 and title like ? limit ?, ?',
                    [userId, searchKeyword, offset, pageSize]
                )
            } else if (isPublished === 'true') {
                return await executeQuery(
                    'select * from surveys where userId=? and isDeleted = 0 and isPublished = 1 and title like ? limit ?, ?',
                    [userId, searchKeyword, offset, pageSize]
                )
            } else if (isPublished === 'false') {
                return await executeQuery(
                    'select * from surveys where userId=? and isDeleted = 0 and isPublished = 0 and title like ? limit ?, ?',
                    [userId, searchKeyword, offset, pageSize]
                )
            }

    }
}

// 问卷排序
exports.sortQuesModel = async (userId, sort, order, offset, pageSize, isPublished, keyword) => {
    if (typeof userId !== 'number') throw Error('userId not number')
    const searchKeyword = `%${keyword}%`
    if (isPublished === 'true') {
        isPublished = true
    } else if (isPublished === 'false') {
        isPublished = false
    }
    switch (order) {
        case 'desc':
            if (isPublished === 'allQues') {
                if (sort === 'createdAt') {
                    return await executeQuery(
                        `select * from surveys where userId = ? and isDeleted = false and title like ? order by createdAt desc limit ?, ?`,
                        [userId, searchKeyword, offset, pageSize]
                    )
                } else if (sort === 'updatedAt') {
                    return await executeQuery(
                        `select * from surveys where userId = ? and isDeleted = false and title like ? order by createdAt desc limit ?, ?`,
                        [userId, searchKeyword, offset, pageSize]
                    )
                }
            } else {
                if (sort === 'createdAt') {
                    return await executeQuery(
                        `select * from surveys where userId = ? and isDeleted = false and isPublished = ? and title like ? order by createdAt desc limit ?, ?`,
                        [userId, isPublished, searchKeyword, offset, pageSize]
                    )
                } else if (sort === 'updatedAt') {
                    return await executeQuery(
                        `select * from surveys where userId = ? and isDeleted = false and isPublished = ? and title like ? order by createdAt desc limit ?, ?`,
                        [userId, isPublished, searchKeyword, offset, pageSize]
                    )
                }
            }


        case 'asc':
            if (sort === 'createdAt') {
                return await executeQuery(
                    `select * from surveys where userId = ? and isDeleted = false and isPublished = ? and title like ? order by createdAt asc limit ?, ?`,
                    [userId, isPublished, searchKeyword, offset, pageSize]
                )
            } else if (sort === 'updatedAt') {
                return await executeQuery(
                    `select * from surveys where userId = ? and isDeleted = false and isPublished = ? and title like ? order by createdAt asc limit ?, ?`,
                    [userId, isPublished, searchKeyword, offset, pageSize]
                )
            }
    }
}

// 更新问卷信息
exports.updateQuestionModel = async (quesId, title, isStar, isPublished, isDeleted, description, isShowOrderIndex, updatedAt, startTime, endTime, isEnableFeedback) => {
    return await executeQuery(
        `UPDATE surveys 
        SET title = ?, isStar = ?, isPublished = ?, isDeleted = ?, description = ?,isShowOrderIndex = ?, updatedAt = ?, startTime = ?, endTime = ?, isEnableFeedback = ?
        WHERE id = ?;`,
        [title, isStar, isPublished, isDeleted, description, isShowOrderIndex, updatedAt, startTime, endTime, isEnableFeedback, quesId]
    )
}

// 复制问卷信息
exports.copyQuestionModel = async (quesId, title) => {
    return await executeQuery(
        `INSERT INTO surveys (title, isStar, isPublished, isDeleted, description, userId, createdAt, updatedAt) 
        SELECT ?, isStar, isPublished, isDeleted, description, userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        FROM surveys
        WHERE id = ?`,
        [title, quesId]
    )
}

// 获取某个问卷的信息
exports.getQuesInfoModel = async (quesId) => {
    return await executeQuery(
        `select * from surveys where id = ?`,
        [quesId]
    )
}

// 根据问卷ID获取该问卷的组件及其组件拥有的属性
exports.getQuestionComponents = async (quesId) => {
    return await executeQuery(
        `
        SELECT 
            qc.*, sc.type, cp.property_key, cp.property_value, cp.id as prop_id ,cp.option_mode, cp.is_complex
        FROM 
            question_components qc
        JOIN 
            system_components sc ON qc.component_id = sc.id
        LEFT JOIN 
            component_properties cp ON qc.id = cp.component_instance_id
        WHERE 
            qc.survey_id = ?
        ORDER BY 
            qc.order_index
    `,
        [quesId]
    )
}