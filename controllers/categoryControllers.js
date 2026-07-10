const Category = require('../models/Category');
const {AppError, asyncHandler} = require('../utils/errorHandlers');
const {sendSuccess} = require('../utils/successResponse');

// Fetches a specific category
exports.getOne = asyncHandler(async(req,res,next) => {
    // Fetches the category by it's id
    const category = await Category.findById(req.params.id);
    // Checks if the category was found, returns a 404 error if not
    if(!category){
        return next(new AppError('The category you are trying to find was not found.', 404));
    }
    sendSuccess(res,category);
});

// Fetches ALL categories
exports.getAll = asyncHandler(async(req,res,next) => {
    const categories = await Category.find();
    sendSuccess(res,categories);
});

// Creates a new category
exports.create = asyncHandler(async(req,res,next) => {
    // Fetches name and description (if the user entered one) from req.body
    const {name,description} = req.body;
    // Checks if the name of the category was entered or not
    if(!name){
        return next(new AppError('Please, enter the category name.', 400));
    }
    // Checks if the name of the category already exists in another category or not
    const duplicate = await Category.findOne({name});
    if(duplicate){
        return next(new AppError('This category name is already used, please change it.', 409));
    }
    // Creates the new category
    const categoryNew = await Category.create({name: name, description: description});
    sendSuccess(res,categoryNew,'Successful Operation', 201);
});

// Deletes a specific category
exports.delete = asyncHandler(async(req,res,next) => {
    // Fetches the category by the id (in the URL) and deletes it
    const category = await Category.findByIdAndDelete(req.params.id);
    // Checks if the category was found, returns a 404 error if not
    if(!category){
        return next(new AppError('The category you are trying to delete was not found.', 404));
    }
    res.status(204).send();
});

// Updates a specific category (patch)
exports.update = asyncHandler(async(req,res,next) => {
    // Checks if req.body is empty or not
    if(!req.body || Object.keys(req.body).length === 0){
        return next(new AppError('Please, enter a specific field to update. (name/description)', 400));
    }
    // Checks if there is another category with the same name that was entered by the user
    const duplicate = await Category.findOne({name: req.body.name});
    if(duplicate && duplicate._id.toString() !== req.params.id){
        return next(new AppError('This category name is already used, please change it.', 409));
    }
    // Fetches the category by the id (in the URL) and updates it, and returning the new version
    const category = await Category.findByIdAndUpdate(req.params.id,
        {$set: req.body},
        {new: true, runValidators: true}
    );
    // Checks if the category was found, returns a 404 error if not
    if(!category){
        return next(new AppError('The category you are trying to update was not found.', 404));
    }
    sendSuccess(res,category);
});