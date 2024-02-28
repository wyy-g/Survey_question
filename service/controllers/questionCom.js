const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/httpStatusCodes')
const { getAllQuesComModel } = require('../models/questionCom')

// 获取系统所有的组件
exports.getAllQuesCom = async (req, res) => {
    try {
        const components = await getAllQuesComModel()
        res.status(OK).send({
            code: OK,
            msg: '',
            data: components
        })
    } catch (err) {
        console.log(err)
        res.status(INTERNAL_SERVER_ERROR).send({
            code: INTERNAL_SERVER_ERROR,
            msg: '服务端内部错误'
        })
    }
}


