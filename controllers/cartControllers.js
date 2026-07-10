const Product = require('../models/Product');
const {AppError, asyncHandler} = require('../utils/errorHandlers');
const Cart = require('../models/Cart');
const {sendSuccess} = require('../utils/successResponse');

// Adds an item to the cart (while also creating a cart for the user if they don't have one)
exports.addCart = asyncHandler(async(req,res,next) => {
    // Fetches user id and product id from req.body
    const {userId,product} = req.body;
    // Fetches quantity from req.body, if it is not provided, the default is 1
    let {quantity} = req.body;
    if(quantity === undefined){
        quantity = 1;
    }
    // Checks if the quantity is a negative number or equals to 0 or is not a number at all, returns an error in these cases
    if(quantity < 0 || quantity === 0 || isNaN(quantity)){
        return next(new AppError('Please, enter a valid quantity for the product.', 400));
    }
    // Converts the quantity to Number
    quantity = Number(quantity);
    // If the user id or the product id werent provided, returns an error
    if(!userId || !product){
        return next(new AppError('Please, enter the userId and product id.', 400));
    }
    // Fetches the product using the product id provided by the user and returns a 404 error if it wasnt found
    const product2 = await Product.findById(product);
    if (!product2) {
        return next(new AppError('The product was not found', 404));
    }
    // Checks to see if the quantity of a product is more than the product's stock
    if(quantity > product2.stock){
        return next(new AppError(`Only ${product2.stock} items available in stock.`, 400));
    }
    // Fetches the user's cart if the user has one, if they dont then it creates a new cart for the user
    let cart = await Cart.findOne({userId: userId});
    if(!cart){
        cart = await Cart.create({userId: userId, items: []});
    }
    // Checks to see if the item is already in the cart, and checks total amount of it to see if its more than the product's stock or not
    const item = cart.items.find(i => i.product.toString() === product);
    if(item){
        if(item.quantity + quantity > product2.stock){
            return next(new AppError(`Not enough stock available, only ${product2.stock} of stock is available.`, 400));
        }
        // If the requested item already exists in the cart, the quantity increases
        item.quantity += quantity;
    } else{
        // If the product is new to the cart, push it to the cart with it's id, quantity, and price
        cart.items.push({product: product, quantity: quantity, price: product2.price});
    }
    // Calculates total price of all items in the cart
    let totalPrice = 0;
    for(const item of cart.items){
        totalPrice += item.quantity * item.price;
    }
    cart.totalPrice = totalPrice;
    // Saves the cart to the database
    await cart.save();
    sendSuccess(res, cart);
});

// Deletes a specific item from the cart (if product was provided) or the whole cart
exports.removeCart = asyncHandler(async(req,res,next) => {
    // Extracts the user ID from the request parameters
    const userId = req.params.id;
    // Fetches the product id from req.body (if it was provided)
    const {product} = req.body;
    // if the user id wasnt provided, returns an error
    if(!userId){
        return next(new AppError('Please, enter the userId.', 400));
    }
    // Fetches the cart using the user id that was provided
    let cart = await Cart.findOne({userId: userId});
    // If the cart wasn't found, returns a 404 error
    if(!cart){
        return next(new AppError('The cart you are searching for was not found', 404));
    }
    // If the user provided a product id in req.body, it removes it from the cart and calculates the total price without the removed product
    if(product){
        cart.items = cart.items.filter(i => i.product.toString() !== product);
        let totalPrice = 0;
        for(const item of cart.items){
            totalPrice += item.quantity * item.price;
        }
        cart.totalPrice = totalPrice;
    } else{
        // If the user didn't provide a product id, the cart empties and total price becomes 0
        cart.items = [];
        cart.totalPrice = 0;
    }
    // Saves the cart to the database
    await cart.save();
    sendSuccess(res,cart);
});

// Updates a cart
exports.updateCart = asyncHandler(async(req,res,next) => {
    // Extracts the user ID from the request parameters
    const userId = req.params.id;
    // Fetches the product id and quantity from req.body, returns an error if it wasn't provided
    const {product,quantity} = req.body;
    if(!product || quantity === undefined){
        return next(new AppError('Please, enter product id and quantity.', 400));
    }
    // Checks if the quantity provided by the user is a negative number or not even a number, returns an error in these cases
    if(quantity < 0 || isNaN(quantity)){
        return next(new AppError('Please, enter a valid quantity for the product.', 400));
    }
    // Fetches the product with the product id provided by the user
    const product2 = await Product.findById(product);
    // Checks if the product was found, returns a 404 error if not
    if (!product2) {
        return next(new AppError('The product you are trying to update was not found', 404));
    }
    // Checks if the quantity is more than the product's stock or not
    if(quantity > product2.stock){
        return next(new AppError(`Only ${product2.stock} of items is available.`, 400));
    }
    // Fetches the cart of the user, if the cart wasn't found it returns a 404 error
    const cart = await Cart.findOne({userId: userId});
    if (!cart) {
        return next(new AppError('The cart you are searching for was not found', 404));
    }
    // Checks if the product is in the cart or not
    const item = cart.items.find(i => i.product.toString() === product);
    if(!item){
        return next(new AppError('The product was not found in the cart', 404));
    }
    // Converts the quantity to Number
    item.quantity = Number(quantity);
    // Fetches the index of the product
    const itemNumber = cart.items.findIndex(i => i.product.toString() === product);
    // If the quantity that was provided === 0, it removed the product
    if(quantity === 0){
        cart.items.splice(itemNumber,1);
    } else{
        // If not, it changes the quantity of the product to the quantity that was provided by the user
        cart.items[itemNumber].quantity = quantity;
    }
    // Calculates the total price of all products
    let totalPrice = 0;
    for(const cartItem of cart.items){
        totalPrice += cartItem.quantity * cartItem.price;
    }
    cart.totalPrice = totalPrice;
    // Saves the cart to the database
    await cart.save();
    sendSuccess(res, cart);
});

// Fetches a user's cart
exports.getCart = asyncHandler(async(req,res,next) => {
    // Extracts the user ID from the request parameters
    const userId = req.params.id;
    // If the user id wasn't provided, it returns an error
    if(!userId){
        return next(new AppError('Please, enter the userId.', 400));
    }
    // Fetches the user's cart and returns the name, price, and stock of each product
    const cart = await Cart.findOne({userId:req.params.id}).populate({
        path: 'items.product',
        select: 'name price stock'
    });
    // If the user doesn't have a cart, it returns a 404 error
    if(!cart){
        return next(new AppError('The cart you are searching for was not found.', 404));
    }
    sendSuccess(res,cart);
});