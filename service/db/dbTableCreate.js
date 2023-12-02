const dbTable = require('./dbSql')

async function createTable(pool) {
    for (let index = 0; index < dbTable.length; index++) {
        try {
            await pool.query(dbTable[index])
        } catch (error) {
            console.log('Table create Error', error)
        }
    }
}

module.exports = createTable



