const mysql2 = require('mysql2/promise')
const createTable = require('./dbTableCreate')
const {
    DB_HOST,
    DB_USER,
    DB_NAME,
    DB_PASSWORD
} = require('./dbConfig')

const pool = mysql2.createPool({
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD
})

async function initDatabase() {
    await createTable(pool)
}

async function executeQuery(sql, values) {
    try {
        const [rows] = await pool.execute(sql, values)
        return rows
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

module.exports = {
    initDatabase,
    executeQuery
}