const { executeQuery } = require('../db/index')

exports.isHaveUser = async (userId) => {
    if (!userId) throw Error('userId not null')
    if (typeof userId !== 'number') throw Error('userId not number')
    return await executeQuery(
        `select * from users where id=?;`, [userId]
    )
}