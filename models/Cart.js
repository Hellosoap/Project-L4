const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please, enter the userId.'],
        unique: true
    },
    items: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref:'Product'
            },
            quantity:{
                type: Number,
                min: [1, 'The minimum of quantity has to be at least 1.'],
                default: 1,
                required: true
            },
            price:{
                type: Number,
                required: true
            }

        }
    ],
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);