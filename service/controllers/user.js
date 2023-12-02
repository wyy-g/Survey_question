const bcrypt = require('bcrypt')
const { register, isHaveUsername } = require('../models/user')
const { generateToken } = require('../utils/authorization')
//const User = require('../models/user')

// 定义加密密码计算强度
const saltRounds = 10

// 是否存在该用户


exports.userRegister = async (req, res) => {
    const { username, password, confirmPwd } = req.body
    if (!username || username.length < 6 || username.length > 15) {
        return res.send({
            code: 1001,
            msg: '用户名长度不符合'
        })
    }

    const userData = await isHaveUsername(username)
    console.log(userData)
    if (userData.length > 0) {
        return res.send({
            code: 1001,
            msg: '该用户名已存在'
        })
    }

    if (!password) return res.send({
        code: 1001,
        msg: '密码不能为空'
    })

    const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');

    if (!pwdRegex.test(password)) {
        return res.send({
            code: 1001,
            msg: '您的密码复杂度太低（密码中必须包含字母、数字），请重新设置'
        })
    }

    if (!confirmPwd) return res.send({
        code: 1001,
        msg: '确认密码不能为空'
    })


    if (password !== confirmPwd) {
        return res.send({
            code: 1001,
            msg: '两次密码不一致'
        })
    }


    // 自动生成盐 和 hash
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'password transion hash error'
            })
        }
        try {
            await register(username, hash)
            res.send({
                code: 200,
                msg: '注册成功'
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({
                success: false,
                msg: '注册失败'
            })
        }
    })
}

exports.userLogin = async (req, res) => {
    // console.log('req.body', req.body)
    const { username, password } = req.body
    if (!username) return res.send({
        code: 1001,
        msg: '用户名不能为空'
    })
    if (!password) return res.send({
        code: 1001,
        msg: '密码不能为空'
    })
    const userData = await isHaveUsername(username)
    console.log(userData)
    if (userData.length <= 0) {
        return res.send({
            code: 1001,
            msg: '该用户名不存在，请重新输入'
        })
    }

    const pass_hash = userData[0].password

    bcrypt.compare(password, pass_hash, function (err, result) {
        if (!result) {
            return res.send({
                code: 1001,
                msg: '密码错误，请重新输入'
            })
        }
        const token = generateToken({ username: username })
        return res.send({
            code: 200,
            msg: '登录成功',
            data: { token }
        })
    });
}