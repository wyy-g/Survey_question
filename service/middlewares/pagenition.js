const pagination = (req, res, next) => {
    const pageSize = parseInt(req.query.pageSize) || 10
    const page = parseInt(req.query.page) || 1
    const offset = (page - 1) * pageSize

    req.offset = offset
    req.pageSize = pageSize
    next()
}

module.exports = pagination