const Product = require('../models/Product');
const {AppError, asyncHandler} = require('../utils/errorHandlers');
const Category = require('../models/Category');
const {sendSuccess} = require('../utils/successResponse');

// Fetching a specific product
exports.getOne = asyncHandler(async(req,res,next) => {
    // Fetches the product by it's id (in the URL) and returns the category name, description and id (using populate)
    const product = await Product.findById(req.params.id)
        .populate({
            path: 'category',
            select: 'name description -_id'
        });
    // Checks if the product was found, returns a 404 error if not
    if(!product){
        return next(new AppError('The product you are trying to find was not found.', 404));
    }
    sendSuccess(res,product);
});

// Fetching ALL products with filtering query
exports.getAll = asyncHandler(async(req,res,next) => {
    // A filter system, the user can fetch whatever items they want based on category, inStock status, price, and name searching
    const filter = {};
    if(req.query.category){
        filter.category = req.query.category;
    }
    if(req.query.inStock){
        filter.inStock = req.query.inStock === 'true';
    }
    if(req.query.minPrice || req.query.maxPrice){
        filter.price = {};
        if(req.query.minPrice){
            filter.price.$gte = Number(req.query.minPrice);
        }
        if(req.query.maxPrice){
            filter.price.$lte = Number(req.query.maxPrice);
        }
    }
    if(req.query.search){
        filter.$or =[
            { name: req.query.search },
            { description: req.query.search }
          ];
    }
    // Fetches all products that matched the filters and returns the category's name, description and id
    const products = await Product.find(filter).populate({
        path: 'category',
        select: 'name description -_id'
    });
    sendSuccess(res,products);
});

// Creates a new product
exports.create = asyncHandler(async(req,res,next) => {
    // Fetches the name, price, stock and category from req.body (stock is optional since its default is 0)
    const {name,description,price,stock,category,images} = req.body;
    // Checks if the name, price, and category were provided, returns an error and a message to the user if not
    if(!name || !price || !category){
        return next(new AppError('Please, enter all required categories (name/price/category) to create the product.', 400));
    }
    // Fetches the category by the category id that was provided by the user, and checks if the category exists or not
    const categoryExists = await Category.findById(category);
    if(!categoryExists){
        return next(new AppError('No category was found. Please, enter an existing category.', 404));
    }
    // Checks if there is a product with the same name or not
    const duplicate = await Product.findOne({name});
    if(duplicate){
        return next(new AppError('This product name is already used, please change it.', 409));
    }
    // Finally, creates the product with the name, price, stock and category
    const product = await Product.create({name,description,price,stock,category,images});
    sendSuccess(res,product,'Successful Operation', 201);
});

// Deletes a specific product
exports.delete = asyncHandler(async(req,res,next) => {
    // Fetches the product by the id that was provided in the URL and deletes it
    const product = await Product.findByIdAndDelete(req.params.id);
    // Checks if the product exists, returns a 404 error if not
    if(!product){
        return next(new AppError('The product was not found.', 404));
    }
    res.status(204).send();
});

// Updates a specific product (patch)
exports.update = asyncHandler(async(req,res,next) => {
    // Checks if req.body is empty or not
    if(!req.body || Object.keys(req.body).length === 0){
        return next(new AppError('Please, enter a specific field to update. (name/price/category/stock)', 400));
    }
    // If the user provided the category field, it checks to see if the category exists or not
    if(req.body.category){
        const categoryExists = await Category.findById(req.body.category);
        if(!categoryExists){
            return next(new AppError('No category was found. Please, enter an existing category.', 404));
        }
    }
    // Checks if there is another product with the same name as the name the user wants to update the product to or not
    const duplicate = await Product.findOne({name: req.body.name});
    if(duplicate && duplicate._id.toString() !== req.params.id){
        return next(new AppError('This product name is already used, please change it.', 409));
    }
    // Updates the inStock status based on the stock, even after updating the stock of a product
    if(req.body.stock !== undefined){
        req.body.inStock = req.body.stock > 0;
    }
    // Fetches the product by the id (in the URL) and updates it
    const product = await Product.findByIdAndUpdate(req.params.id,
        {$set: req.body},
        {new: true, runValidators: true}
    );
    // Checks to see if the product awaiting the updates exists, returns a 404 error if not
    if(!product){
        return next(new AppError('The product was not found.', 404));
    }
    sendSuccess(res,product);
});