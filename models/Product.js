const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required:[true,'Please, enter the name of the product.']
    },
    description: {
        type: String,
        trim: true,
        default: 'This product has no description.'
    },
    price:{
        type:Number,
        required:[true,'Please, enter the price of the product.'],
        min:[0,'The price can not be less than 0.']
    },
    stock:{
        type:Number,
        min:[0,'The stock amount can not be less than 0.'],
        default: 0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'Please, enter the category of the product.'],
        ref: 'Category'
    },
    images: {
        type: [String],
        default: []
    },
    inStock: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true
});

productSchema.pre('save', function() {
    if(this.stock > 0){
        this.inStock = true;
    }else {
        this.inStock = false;
    }
});

module.exports = mongoose.model('Product', productSchema);