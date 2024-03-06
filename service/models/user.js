const { executeQuery } = require('../db/index')

// module.exports = class User {
//     constructor(username, password) {

//         this.username = username
//         this.password = password
//         console.log(username, password)
//     }

//     static async register() {
//         return executeQuery(`
//             insert into users (username, password) values (?,?)`,
//             [this.username, this.password]
//         )
//     }
// }

exports.register = async (username, password) => {
    return executeQuery(
        `insert into users (username, password) values (?,?)`,
        [username, password]
    )
}
exports.isHaveUsername = async (username) => {
    if (!username) throw Error('username not null')
    const res = await executeQuery(
        `select * from users where username=?;`, [username]
    )
    return res
}

exports.updateUserInfo = async (userInfo) => {
    let sql = "UPDATE users SET ";
    let values = [];

    if (userInfo.headImg) {
        sql += "headImg = ?,";
        values.push(userInfo.headImg);
    }
    if (userInfo.nickname) {
        sql += "nickname = ?,";
        values.push(userInfo.nickname);
    }
    if (userInfo.email) {
        sql += "email = ?,";
        values.push(userInfo.email);
    }
    // 移除最后一个逗号并添加where子句
    sql = sql.slice(0, -1) + " WHERE id = ?";

    values.push(userInfo.userId);

    const res = await executeQuery(sql, values);
    return res;
}