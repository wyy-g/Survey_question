const jwt = require('jsonwebtoken')
const { UNAUTHORIZED } = require('../utils/httpStatusCodes')
const secretKey = "admin_secretKey"
const JWT_EXPIRESIN = 60 * 60

// 生成token
exports.generateToken = function (payload) {
    const token = "Bearer " + jwt.sign(payload, secretKey, {
        expiresIn: JWT_EXPIRESIN
    })
    return token.split(" ")[1]
}

// 验证token
exports.verifyToken = function (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1] || req.query.token || ''
    // req.params { '0': '接口地址'}
    if (req.params['0'].split('/')[0] === 'question' && req.method === 'GET') {
        next()
        return
    }
    // 提交答案不需要登录

    if (req.params['0'] === 'answers' && req.method === 'POST') {
        next()
        return
    }
    // 提交反馈可能不需要登录
    if (req.params['0'].split('/')[0] === 'feedback' && req.method === 'POST') {
        next()
        return
    }

    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            console.log("verify token error", err)
            return res.status(UNAUTHORIZED).send({
                code: UNAUTHORIZED,
                msg: 'token 无效或已过期'
            })
        }
        next()
    })
} 