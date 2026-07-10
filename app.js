const config = require('./config/db');
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

// Importing the routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());

// This makes req.query writable. Without it, express-mongo-santitize stops postman from working
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true,
    enumerable: true,
    configurable: true
  });
  next();
});

app.use(mongoSanitize());

// Using the routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 middleware
app.use((req, res, next) => {
    res.status(404).json({ error: "The URL you are trying to find was not found.", });
});

// Central Error Handler
app.use((error, req, res, next) => {
    if(error.name === 'ValidationError' || error.name === 'CastError'){
        error.statusCode = 400;
        error.isOperational = true;
    }else if(error.code === 11000){
        error.statusCode = 409;
        error.isOperational = true;
    }
    error.statusCode = error.statusCode || 500;
    res.status(error.statusCode).json({
        status: error.status || 'Error',
        message: error.isOperational ? error.message : 'Something went wrong.',
        data: null
    });
});

// Connecting to MongoDB and turning on the server
mongoose.connect(config.mongoUrl).then(() => {
    app.listen(config.port, () => console.log('Server is working.'));
});