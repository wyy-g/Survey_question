const { executeQuery } = require('../db/index')

// module.exports = class User {
//     constructor(username, password) {

//         this.username = username
//         this.password = password
//         console.log(username, password)
//     }

//     static async register() {
//         return executeQuery(`
//             insert into users (account, password) values (?,?)`,
//             [this.username, this.password]
//         )
//     }
// }

exports.register = async (username, password) => {
    return executeQuery(
        `insert into users (account, password) values (?,?)`,
        [username, password]
    )
}
exports.isHaveUsername = async (username) => {
    if (!username) throw Error('username not null')
    console.log(typeof username)
    const res = await executeQuery(
        `select * from users where account=?;`, [username]
    )
    return res
}
