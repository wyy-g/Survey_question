const express = require('express')
const cors = require('cors')
const path = require('path')
const expressWs = require('express-ws');
require('dotenv').config();

const userRouter = require('./routes/user')
const questionRouter = require('./routes/question.js')
const quesComRouter = require('./routes/quesComponent.js')
const problemRouter = require('./routes/problem.js')
const answerRouter = require('./routes/answer.js')
const notificationRouter = require('./routes/notification.js')

const { initDatabase } = require('./db/index.js');
const addApiPrefix = require('./middlewares/addApiPrefix.js')
const WebSocketManager = require('./utils/webSocketManager.js')

const app = express()

// initDatabase()

expressWs(app); // 将WebSocket支持混入到Express应用中
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())

// app.all('*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-headers', 'Content-Type')
//     res.header('Access-Contril-Allow-Methods', 'GET, POST, PUT, DELETE')
//     res.header('Content-Type', 'application/json;charset=utf-8')
//     next()
// })

// 初始化WebSocket服务
app.ws('/feedback-notifications', (ws, req) => {
    const userId = req.query.userId
    if (userId) {
        // const  userWebSockets = new Map()
        WebSocketManager.addUserWebSocket(Number(userId), ws)
        // 处理WebSocket关闭事件
        ws.on('close', () => {
            WebSocketManager.removeUserWebSocket(Number(userId))
        });
    }
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(addApiPrefix)
app.use(userRouter)
app.use(questionRouter)
app.use(quesComRouter)
// app.use(problemRouter)
app.use(answerRouter)
app.use(notificationRouter)


const PORT = process.env.PORT || 3031

app.listen(PORT, () => {
    console.log(`正在监听${PORT}端口`)
})