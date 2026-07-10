// Response for successful operations
exports.sendSuccess = (res,data,message = "Successful Operation",statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'Success',
        message: message,
        data: data
    });
};