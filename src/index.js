const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;
const errorHandler = require('./middleware/errorHandler');


require('express-async-errors');
require('dotenv').config();
require('./db/mongoose');

const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(express.static('public'));
app.use(errorHandler);



app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
