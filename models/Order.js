const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderNumber:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please, enter the userId.'],
    },
    items: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'Product'
            },
            name:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            quantity:{
                type: Number,
                min: [1, 'The minimum of quantity has to be at least 1.'],
                default: 1,
                required: true
            },

        }
    ],
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    status:{
        type: String,
        enum:['Pending', 'Shipped', 'Delievered', 'Cancelled'],
        default: 'Pending',
        required: true
    },
    shippingAddress: {
        type: String,
        required: [true, 'Please, enter your shipping Address.'],
        trim: true
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);