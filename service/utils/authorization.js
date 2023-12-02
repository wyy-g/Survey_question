const jwt = require('jsonwebtoken')

const secretKey = "admin_secretKey"

// 生成token
exports.generateToken = function (payload) {
    const token = "Bearer" + jwt.sign(payload, secretKey, {
        expiresIn: 60 * 60
    })
    return token
}

// 验证token
exports.verifyToken = function (req, res, next) {
    const token = req.headers.authorization?.split("")[1] || ''
    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
            console.log("verify token error", err)
            return res.json({
                code: 404,
                msg: 'token 无效'
            })
        }
        next()
    })
} 