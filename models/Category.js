const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please, enter the category name.'],
        trim: true,
        unique: true
    },
    description:{
        type: String,
        trim: true,
        default: 'This category has no description.'
    },
    slug:{
        type: String,
        required: [true, 'Please, enter the category slug.'],
        lowercase: true,
        trim: true,
        unique: true
    }
}, { 
    timestamps: true
});

categorySchema.pre('validate', function(){
    if(this.name){
        this.slug = this.name.toLowerCase()
    };
});

module.exports = mongoose.model('Category', categorySchema);