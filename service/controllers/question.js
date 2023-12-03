const {
    createOneQues,
    getUserAllQues,
    getUserStarQues
} = require('../models/question')
const { isHaveUser } = require('../models/common')
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/httpStatusCodes')

exports.createQues = async (req, res) => {
    const {
        title,
        description = null,
        userId
    } = req.body

    const isPublished = req.body.isPublished === 'true' || req.body.isPublished === '1'
    const isStar = req.body.isStar === 'true' || req.body.isStar === 1
    const isDeleted = req.body.isStar === 'true' || req.body.isDeleted === 1

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

    try {
        const userAllQues = await getUserAllQues(Number(userId))
        if (userAllQues.length <= 0) {
            return res.status(NOT_FOUND).send({
                code: NOT_FOUND,
                msg: '请检查用户ID是否正确',
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
    const isStar = req.query.isStar === 'true' || req.query.isStar === '1'

    if (!userId) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'userId 不能为空'
        })
    }

    if (!isStar) {
        return res.status(BAD_REQUEST).send({
            code: BAD_REQUEST,
            msg: 'isStar 不存在 或为false'
        })
    }

    try {
        const userStarQues = await getUserStarQues(Number(userId), isStar)
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

