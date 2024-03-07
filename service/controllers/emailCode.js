const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const { createVerifyCode, deleteVerifyCode, getEmail, verifySubmitCode } = require('../models/verifyCode')

const transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.qq.com', // 服务 由于我用的163邮箱
    port: 465, // smtp端口 默认无需改动
    secure: true,
    auth: {
        user: '1482581329@qq.com', // 用户名
        pass: 'nydyycjudkjjbaed' // SMTP授权码
    }
}));


exports.sendMailCode = async (req, res) => {

    const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则
    let EMAIL = req.body.email //req为请求体对象 我使用的是post请求方式，所以通过req.body获取用户提交的邮箱

    // 生成6位随机数
    function randomFns() {
        let code = ""
        for (let i = 0; i < 6; i++) {
            code += parseInt(Math.random() * 10)
        }
        return code
    }

    if (regEmail.test(EMAIL)) {  //邮箱验证通过
        let code = randomFns()
        transport.sendMail({
            from: '1482581329@qq.com', // 发件邮箱
            to: EMAIL, // 收件列表
            subject: '验证你的电子邮件', // 标题
            html: `
            <p>你好！</p>
            <p>您正在注册问卷调查账号</p>
            <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>***该验证码5分钟内有效***</p>` // html 内容
        }, async (error, info) => {
            if (error) {
                res.status(500).send({
                    code: 500,
                    mag: '邮箱验证未通过'
                })
            } else {
                const isExistEmail = await getEmail(EMAIL)
                if (isExistEmail.length > 0) {
                    await deleteVerifyCode(EMAIL)
                }
                await createVerifyCode(EMAIL, code)
                res.status(200).send({
                    code: 200,
                    data: {
                        code
                    },
                    message: '验证码已发送，请查收邮件并完成验证',
                });
                transport.close();
            }
        })
        //....验证码发送后的相关工作 
    } else {
        // 邮箱格式不正确
        res.status(422).send({
            code: 422,
            message: '请输入正确的邮箱格式！',
        });
    }
}

exports.verifySubmitEmailAndCode = async (req, res) => {
    const { email, code } = req.body
    const verifyRes = await verifySubmitCode(email, code)
    if (verifyRes.length > 0) {
        res.status(200).send({
            code: 200,
            data: {
                code,
            },
            message: '验证码通过'
        })
    }
}



