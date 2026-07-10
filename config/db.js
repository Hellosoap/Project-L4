require('dotenv').config();

// Checks if the file has a Mongo url or not
if(!process.env.MONGO_URL){
    throw new error('MONGO_URL is not defined.')
}

// Checks if the file has a port or not.
if(!process.env.PORT){
    throw new error('PORT is not defined.')
}

// Finally creates a variable containing enviroment values for the functioning of the app
const config ={
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGO_URL,
    nodeEnv: process.env.NODE_ENV || 'development', 
}

module.exports = config