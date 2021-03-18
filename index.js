const express = require('express');
var cors = require('cors')
require('./db_connection/mongodb');
const userRouter = require('./routers/user')
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders')
const logsMiddleware = require('./middlewares/logs');
const app = express();


app.use(cors())
app.use(express.static('public'));
app.use(express.json());
app.use(logsMiddleware)


app.use('/api/users', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);


app.listen(process.env.PORT || 3000, () => {
    console.info(`server listening on port 3000`);
});