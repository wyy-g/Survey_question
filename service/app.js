const express = require('express')
const cors = require('cors')
require('dotenv').config();

const userRouter = require('./routes/user')
const questionRouter = require('./routes/question.js')
const quesComRouter = require('./routes/quesComponent.js')
const problemRouter = require('./routes/problem.js')
const answerRouter = require('./routes/answer.js')

const { initDatabase } = require('./db/index.js');
const addApiPrefix = require('./middlewares/addApiPrefix.js')

const app = express()

// initDatabase()

app.use(cors())

// app.all('*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-headers', 'Content-Type')
//     res.header('Access-Contril-Allow-Methods', 'GET, POST, PUT, DELETE')
//     res.header('Content-Type', 'application/json;charset=utf-8')
//     next()
// })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(addApiPrefix)
app.use(userRouter)
app.use(questionRouter)
app.use(quesComRouter)
// app.use(problemRouter)
app.use(answerRouter)


const PORT = process.env.PORT || 3031

app.listen(PORT, () => {
    console.log(`正在监听${PORT}端口`)
})