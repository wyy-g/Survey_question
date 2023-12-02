// 路由处理器，用于添加 'api' 前缀并转发到正确的子路由
const addApiPrefix = (req, res, next) => {
    if (!/^\/api/.test(req.url)) { // 如果 URL 中没有 'api' 前缀
        req.url = `/api${req.url}`; // 添加 'api' 前缀
    }
    next(); // 转发到下一个匹配的路由
}
module.exports = addApiPrefix