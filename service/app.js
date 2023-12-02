const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/user')

const { initDatabase } = require('./db/index.js');
const addApiPrefix = require('./middlewares/addApiPrefix.js')

const app = express()

initDatabase()

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(addApiPrefix)
app.use(userRoutes)

const PORT = process.env.PORT || 3031

app.listen(PORT, () => {
    console.log(`正在监听${PORT}端口`)
})