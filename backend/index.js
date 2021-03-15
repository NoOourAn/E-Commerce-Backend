const express = require('express');
var cors = require('cors')
require('./db_connection/mongodb');
const userRouter = require('./routers/user')
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders')
const authenticationMiddleware = require('./middlewares/authentication');
const logsMiddleware = require('./middlewares/logs');
const errorHandlerMiddleware = require('./middlewares/errorhandler');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
require('dotenv/config');

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())


const app = express();
app.use(cors())

app.use(express.static('public'));
app.use(express.json());

app.use('/api/users', logsMiddleware, userRouter);
app.use('/api/products', logsMiddleware, productsRouter);
app.use('/api/orders', logsMiddleware, ordersRouter);


app.use(errorHandlerMiddleware)


app.listen(process.env.PORT || 3000, () => {
    console.info(`server listening on port 3000`);
});