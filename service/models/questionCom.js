const { executeQuery } = require('../db/index')

exports.getAllQuesComModel = () => {
    return executeQuery(
        `select * from ques_components`
    )
}