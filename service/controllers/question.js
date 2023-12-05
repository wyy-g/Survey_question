const {
    createOneQues,
    getUserAllQues,
    getUserStarQues,
    getUserDelQues,
    hidQuse,
    setStarStatusModel,
    recoverQuesModel,
    delQuesModel,
    searchQuesModel
} = require('../models/question')
const { isHaveUser, isHaveQues } = require('../models/common')
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/httpStatusCodes')

exports.createQues = async (req, res) => {
    const {
        title,
        description = null,
        userId
    } = req.body

    const isPublished = req.body.isPublished === 'true' || req.body.isPublished > 0
    const isStar = req.body.isStar === 'true' || req.body.isStar > 0
    const isDeleted = req.body.isStar === 'true' || req.body.isDeleted > 0

    if (!title) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'title 不能为空'
        })
    }

    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    try {
        const userData = await isHaveUser(Number(userId))
        if (userData.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '该用户不存在'
            })
        }

        await createOneQues(title, description, isPublished, isStar, isDeleted, Number(userId))
        res.status(CREATED).send({
            code: CREATED,
            msg: '创建问卷成功'
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务器内部错误'
        })
    }
}

// 获取某个用户的所有问卷列表
exports.getUserQuesList = async (req, res) => {
    const { userId } = req.query

    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    if (typeof Number(userId) !== 'number') {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不是一个数字'
        })
    }

    const userData = await isHaveUser(Number(userId))
    if (userData.length <= 0) {
        return res.status(NOT_FOUND).send({
            code: NOT_FOUND,
            msg: '该用户不存在'
        })
    }

    try {
        const userAllQues = await getUserAllQues(Number(userId), req.offset, req.pageSize)
        if (userAllQues.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '暂时还没有数据',
                data: {
                    userAllQues
                }
            })
        }
        return res.status(OK).send({
            code: OK,
            msg: '',
            data: {
                userAllQues
            }
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务器内部错误'
        })
    }
}

//获取用户的标星问卷
exports.getUserStar = async (req, res) => {
    const { userId } = req.query
    const isStar = req.query.isStar === 'true' || req.query.isStar > 0

    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    const userData = await isHaveUser(Number(userId))
    if (userData.length <= 0) {
        return res.status(NOT_FOUND).send({
            code: NOT_FOUND,
            msg: '该用户不存在'
        })
    }

    if (!isStar) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'isStar 不存在 或为false'
        })
    }

    try {
        const userStarQues = await getUserStarQues(Number(userId), isStar, req.offset, req.pageSize)
        if (userStarQues.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '没有找到标星问卷',
            })
        }

        return res.status(OK).send({
            code: OK,
            msg: '',
            data: {
                userStarQues
            }
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务器内部错误'
        })
    }
}

// 获取用户已删除的问卷
exports.getUserDel = async (req, res) => {
    const { userId } = req.query
    const isDeleted = req.query.isDeleted === 'true' || req.query.isDeleted > 0

    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    const userData = await isHaveUser(Number(userId))
    if (userData.length <= 0) {
        return res.status(NOT_FOUND).send({
            code: NOT_FOUND,
            msg: '该用户不存在'
        })
    }

    if (!isDeleted) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'isDeleted 不存在 或为false'
        })
    }

    try {
        const userDelQues = await getUserDelQues(Number(userId), isDeleted, req.offset, req.pageSize)
        if (userDelQues.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '没有找到被删除的问卷',
            })
        }

        return res.status(OK).send({
            code: OK,
            msg: '',
            data: {
                userDelQues
            }
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务器内部错误'
        })
    }
}

// 假删除某个问卷
exports.hiddenQues = async (req, res) => {
    const { userId, quesId } = req.query
    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    const userData = await isHaveUser(Number(userId))
    if (userData.length <= 0) {
        return res.status(NOT_FOUND).send({
            code: NOT_FOUND,
            msg: '该用户不存在'
        })
    }

    if (!quesId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'quesId 不能为空'
        })
    }

    try {
        const quesData = await isHaveQues(Number(quesId))
        if (quesData.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '该问卷不存在'
            })
        }

        await hidQuse(Number(userId), Number(quesId))
        return res.status(OK).send({
            code: OK,
            msg: ''
        })
    } catch (err) {
        console.log(err)
        return res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }

}

// 标星与取消标星
exports.setStarStatus = async (req, res) => {
    const { userId, quesId } = req.body
    const isStar = req.body.isStar === 'true' || req.body.isStar > 0
    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    const userData = await isHaveUser(Number(userId))
    if (userData.length <= 0) {
        return res.status(NOT_FOUND).send({
            code: NOT_FOUND,
            msg: '该用户不存在'
        })
    }

    if (!quesId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'quesId 不能为空'
        })
    }

    try {
        const quesData = await isHaveQues(Number(quesId))
        if (quesData.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '该问卷不存在'
            })
        }
        await setStarStatusModel(Number(userId), Number(quesId), isStar)
        return res.status(OK).send({
            code: OK,
            msg: ''
        })
    } catch (err) {
        console.log(err)
        return res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}

// 恢复问卷
exports.recoverQues = async (req, res) => {
    const quesId = req.params.id
    try {
        const quesData = await isHaveQues(Number(quesId))
        if (quesData.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '该问卷不存在'
            })
        }
        await recoverQuesModel(Number(quesId))
        return res.status(OK).send({
            code: OK,
            msg: ''
        })
    } catch (err) {
        console.log(err)
        return res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}

// 彻底删除某个问卷（从回收站中删除）
exports.delQues = async (req, res) => {
    const quesId = req.params.id
    try {
        const quesData = await isHaveQues(Number(quesId))
        if (quesData.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '该问卷不存在'
            })
        }
        await delQuesModel(Number(quesId))
        return res.status(OK).send({
            code: OK,
            msg: ''
        })
    } catch (err) {
        console.log(err)
        return res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}

// 搜索问卷
exports.searchQues = async (req, res) => {
    const { userId, keyword } = req.query

    const isStar = req.query.isStar === 'true' || req.body.query > 0
    const isDeleted = req.query.isDeleted === 'true' || req.body.query > 0

    try {
        let quesData = await searchQuesModel(Number(userId), keyword, isStar, isDeleted, req.offset, req.pageSize)
        // 如果不是搜索回收站则过滤掉在回收站中的问卷
        if (!isDeleted) {
            quesData = quesData.filter(item => item.isDeleted == 0)
            console.log(quesData)
        }
        return res.status(OK).send({
            code: OK,
            msg: '',
            data: {
                quesData
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}
