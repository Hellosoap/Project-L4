const Order = require('../models/Order');
const Cart = require('../models/Cart');
const {AppError, asyncHandler} = require('../utils/errorHandlers');
const {sendSuccess} = require('../utils/successResponse');

// Creates an order for the user
exports.create = asyncHandler(async(req,res,next) => {
    // Fetches user's id and the shippingAddress from req.body and checks if its written or not
    const {userId, shippingAddress} = req.body;
    if(!userId || !shippingAddress){
        return next(new AppError('Please, enter your (userId/shippingAddress)', 400));
    }
    // Fetches the user's cart using the user's id and checks if its empty or if that user has no cart
    const cart = await Cart.findOne({userId: userId}).populate('items.product');
    if(!cart || cart.items.length === 0){
        return next(new AppError('The cart you are trying to find is empty.', 400));
    }
    // Checks the stock for all items to function correctly
    for(const item of cart.items){
        if(item.product.stock < item.quantity){
            return next(new AppError(`${item.product.name} is out of stock, creating order failed.`, 400));
        }
    }
    // Starts creating the inside of the order and calculating the totalPrice
    let totalPrice = 0;
    let order = [];
    for (const item of cart.items){
        totalPrice += item.quantity * item.product.price;
        order.push({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        });
        item.product.stock -= item.quantity;
        await item.product.save();
    }
    // Empties the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    // Creates an orderNumber for the order, and creates the final order receipt and showcasing it to the user
    const orderNumber = `ORDER-${Date.now()}`;
    const createdOrder = await Order.create({
        orderNumber: orderNumber,
        userId: userId,
        totalPrice: totalPrice,
        items: order,
        shippingAddress: shippingAddress
    });
    sendSuccess(res,createdOrder,'Order has been successfully created.',201);
});

// Fetches ALL orders
exports.getAll = asyncHandler(async(req,res,next) => {
    const orders = await Order.find();
    sendSuccess(res,orders);
});

// Fetches a specific order
exports.getOne = asyncHandler(async(req,res,next) => {
    // Fetches the order by the provided id
    const order = await Order.findById(req.params.id);
    // If the order was not found, returns a 404 error
    if(!order){
        return next(new AppError('The order you are trying to find was not found.', 404));
    }
    sendSuccess(res,order);
});

// Updates only the status of an order
exports.update = asyncHandler(async(req,res,next) => {
    // Fetches the status from req.body
    const {status} = req.body;
    // this section fetches the valid statuses from the Order schema 
    // And checks if the status that was written by the user in req.body in the valid statuses or not
    // Also checks if the status was provided by the user or not
    const validStatuses = Order.schema.path('status').enumValues;
    if(!status){
        return next(new AppError('Please, enter the status.', 400));
    }
    if(!validStatuses.includes(status)){
        return next(new AppError('Please, enter a valid status value.', 400));
    }
    // Fetches the order by the id, and updates the status field ONLY
    const order = await Order.findByIdAndUpdate(req.params.id,
        {status},
        {new: true, runValidators: true}
    );
    // If the order was not found, returns a 404 error
    if(!order){
        return next(new AppError('The order you are trying to find was not found.', 404));
    }
    sendSuccess(res,order);
});