const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    PlacedDate: {
        type: Date,
        default: Date.now,

    },
    totalPrice: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    },
    products: [{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Product',
        productName: {
            type: String,
        },
        quantity: {
            type: Number
        }
    }]

}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;