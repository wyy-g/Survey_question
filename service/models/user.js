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
