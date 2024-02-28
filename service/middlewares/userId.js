const { isHaveUser } = require('../models/common')
const isHaveUserId = async (req, res, next) => {
    if (req.params['0'].split('/')[0] === 'question' && req.method === 'GET') {
        next()
        return
    }
    if (req.params['0'] === 'answers' && req.method === 'POST') {
        next()
        return
    }
    if (req.params['0'].split('/')[0] === 'download' && req.method === 'GET') {
        next()
        return
    }
    let userId = req.header('x-user-id');
    const userData = await isHaveUser(Number(userId))
    if (userId && userData.length > 0) {
        req.userId = userId; // 将验证后的userId挂载到req对象上供后续中间件或路由使用
        next(); // 调用下一个中间件或路由处理器
    } else {
        res.status(401).json({ message: '无效的用户ID' });
    }
}

module.exports = isHaveUserId