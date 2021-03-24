const express = require('express');
const Orders = require('../models/order');
const authenticationMiddleware = require('../middlewares/authentication');
const orderRouter = new express.Router();

orderRouter.use(authenticationMiddleware)


// user can get his orders or admin
orderRouter.get('/', async(req, res) => {
    try {
        let orders;
        console.log(req.type);
        if (req.type == "admin")
            orders = await Orders.find({});
        else
            orders = await Orders.find({ user: req.signedData.id });

        const obj = {
            statusCode: 201,
            success: true,
            orders: orders
        }
        res.send(obj)

    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: err.message });
    }

})

// user can post order
orderRouter.post('/', async(req, res) => {
    // console.log(req);
    console.log(req.body);

    try {
        const { totalPrice, products } = req.body;
        console.log(products);

        const order = await Orders.create({ user: req.signedData.id, totalPrice, products })

        const obj = {
            statusCode: 201,
            success: true,
            message: "order was created succesfully",
            order: order
        }
        res.send(obj)

    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: err.message });
    }


})

// admin can modify order status
orderRouter.patch('/:id', async(req, res) => {
    const { status } = req.body;
    try {
        if (req.type == "admin"){

            const order = await Orders.updateOne({ _id: req.params.id }, { status: req.body.status });
            const obj = {
                statusCode: 201,
                success: true,
                message: "order was edited succesfully",
                order: order
            }
            res.send(obj)    
        }else res.json({ success: false, message: "not authorized as admin" });
    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: err.message });

    }
})

// user can delete order if it is pending
orderRouter.delete('/:id', async(req, res) => {
    console.log(req.params.id);
    console.log(req.signedData.id)
    try {
        let order
        if (req.type == "admin")
            order = await Orders.findOne({ _id: req.params.id });
        else
            order = await Orders.findOne({ _id: req.params.id, user: req.signedData.id });
        console.log(order);
        if (order && order.status == "pending") {
            order = await Orders.deleteOne({ _id: req.params.id, user: req.signedData.id });
            res.json({ success: true, message: "order deleted successfully" });
        } else res.json({ success: false, message: "order not pending" });
    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: err.message });
    }
})

module.exports = orderRouter;