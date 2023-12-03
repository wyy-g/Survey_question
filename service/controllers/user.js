const bcrypt = require('bcrypt')
const { register, isHaveUsername } = require('../models/user')
const { generateToken } = require('../middlewares/authorization')
const { OK, CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('../utils/httpStatusCodes')
//const User = require('../models/user')

// 定义加密密码计算强度
const saltRounds = 10

// 是否存在该用户


exports.userRegister = async (req, res) => {
	const { username, password, confirmPwd } = req.body
	if (!username || username.length < 6 || username.length > 15) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: '用户名长度不符合'
		})
	}

	const userData = await isHaveUsername(username)
	console.log(userData)
	if (userData.length > 0) {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: '该用户名已存在'
		})
	}

	if (!password) return res.send({
		code: BAD_REQUEST,
		msg: '密码不能为空'
	})

	const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');

	if (!pwdRegex.test(password)) {
		return res.send({
			code: BAD_REQUEST,
			msg: '您的密码复杂度太低（密码中必须包含字母、数字），请重新设置'
		})
	}

	if (!confirmPwd) return res.send({
		code: BAD_REQUEST,
		msg: '确认密码不能为空'
	})


	if (password !== confirmPwd) {
		return res.send({
			code: BAD_REQUEST,
			msg: '两次密码不一致'
		})
	}


	// 自动生成盐 和 hash
	bcrypt.hash(password, saltRounds, async (err, hash) => {
		if (err) {
			return res.status(INTERNAL_SERVER_ERROR).json({
				success: false,
				message: 'password transion hash error'
			})
		}
		try {
			await register(username, hash)
			res.send({
				code: CREATED,
				msg: '注册成功'
			})
		} catch (err) {
			console.error(err)
			res.status(INTERNAL_SERVER_ERROR).json({
				code: INTERNAL_SERVER_ERROR,
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
		code: BAD_REQUEST,
		msg: '用户名不能为空'
	})
	if (!password) return res.send({
		code: BAD_REQUEST,
		msg: '密码不能为空'
	})
	const userData = await isHaveUsername(username)

	if (userData.length <= 0) {
		return res.status(NOT_FOUND).send({
			code: NOT_FOUND,
			msg: '该用户名不存在，请重新输入'
		})
	}

	const pass_hash = userData[0].password

	bcrypt.compare(password, pass_hash, function (err, result) {
		if (!result) {
			return res.send({
				code: BAD_REQUEST,
				msg: '密码错误，请重新输入'
			})
		}
		const token = generateToken({ username: username })
		return res.send({
			code: OK,
			msg: '登录成功',
			data: { token }
		})
	});
}

exports.getUserInfo = async (req, res) => {
	const { username } = req.query
	if (!username || typeof username !== 'string') {
		return res.status(BAD_REQUEST).send({
			code: BAD_REQUEST,
			msg: '用户名为空或格式不正确'
		})
	}
	try {
		const userData = await isHaveUsername(username)
		if (userData.length <= 0) {
			return res.status(NOT_FOUND).send({
				code: NOT_FOUND,
				msg: '该用户不存在'
			})
		}
		if (userData[0].password) delete userData[0].password

		return res.status(OK).send({
			code: OK,
			msg: '',
			data: {
				...userData[0]
			}
		})
	} catch (err) {
		console.log(err)
		return res.status(INTERNAL_SERVER_ERROR).send({
			code: INTERNAL_SERVER_ERROR,
			msg: '服务器内部错误'
		})
	}
}