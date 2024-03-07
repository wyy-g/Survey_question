const { executeQuery } = require('../db/index')

exports.createVerifyCode = async (email, code) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 设置5分钟后过期
    const res = await executeQuery(
        'INSERT INTO verifications (email, code, expires_at) VALUES (?, ?, ?)',
        [email, code, expiresAt]
    )
    return res
};

exports.deleteVerifyCode = async (email) => {
    const res = await executeQuery(
        'DELETE FROM verifications WHERE email = ?',
        [email]
    )
    return res
};

// 查询数据表中是否已经存在该邮箱
exports.getEmail = async (email) => {
    const res = await executeQuery(
        'SELECT * FROM verifications WHERE email = ?',
        [email]
    )
    return res
}

exports.verifySubmitCode = async (email, submitCode) => {
    // return await executeQuery(
    //     `
    //     SELECT * FROM verifications WHERE email = ? AND code = ? AND expires_at > NOW()
    //     `,
    //     [email, submitCode]
    // )
    const res = await executeQuery(
        'SELECT * FROM verifications WHERE email = ? and code = ?',
        [email, submitCode]
    )
    return res
}