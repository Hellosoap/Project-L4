const config = require('./config/db');
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Order = require('./models/Order')
const Product = require('./models/Product');

const seed = async() =>{
    try{
        await mongoose.connect(config.mongoUrl);
        await Order.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log("Cleaning done.");
        const makeup = await Category.create({
            name: 'Makeup',
            description: 'Amazing products for your makeup look.'
        });
        const clothes = await Category.create({
            name: 'Clothes',
            description: 'Amazing clothes, fits all ages.'
        });
        const furniture = await Category.create({
            name: 'Furniture',
            description: 'Clean furniture, supports everyday human life.'
        });
        const categories = [makeup,clothes,furniture]
        console.log("Creating new products..");
        const products = await Product.create([
            {
                name: 'Lipstick',
                price: 20,
                stock: 10,
                category: makeup._id
            },
            {
                name: 'Mascara',
                price: 30,
                stock: 15,
                category: makeup._id
            },
            {
                name: 'Hoodie',
                price: 70,
                stock: 5,
                category: clothes._id
            },
            {
                name: 'Jeans',
                price: 100,
                stock: 12,
                category: clothes._id
            },
            {
                name: 'Sofa',
                price: 300,
                stock: 10,
                category: furniture._id
            },
            {
                name: 'Round Table',
                price: 200,
                stock: 20,
                category: furniture._id
            }
        ]);
        console.log(`${products.length + categories.length} docs have been created and added to the database.`);
    } catch(error){
        console.log("Error! Couldn't create data.", error.message);
        process.exit(1);
    } finally{
        await mongoose.disconnect();
        console.log('Database disconnected.')
    }
}

seed();