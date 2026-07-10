module.exports = ((error, req, res, next) => {
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