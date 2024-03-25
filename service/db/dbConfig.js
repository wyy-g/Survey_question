const DB_HOST = 'localhost'
const DB_USER = 'root'
const DB_NAME = 'survey_ques'
const DB_PASSWORD = process.env.NODE_ENV === 'production' ? process.env.PROD_MYSQL_PASSWORD : ''

module.exports = {
    DB_HOST,
    DB_USER,
    DB_NAME,
    DB_PASSWORD
}