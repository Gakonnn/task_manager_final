const express = require('express')
const userRoutes = require('../src/routes/users')
const taskRoutes = require('../src/routes/tasks')
const limiter = require('./middleware/rateLimiter');
require('./db/mongoose')


const app = express()

app.use(limiter); 
app.use(express.json())
app.use(userRoutes, taskRoutes)


module.exports = app