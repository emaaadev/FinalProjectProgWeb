const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
        
    }, 
    name: {
        type: String,
        required: true
        
    }, 
    image: {
        type: String,
        required: false
        
    }, 
    description: {
        type: String,
        required: false
        
    },
    stock: {
        type: Number,
        required: true
        
    }, 
    price: {
        type: Number,
        required: true
        
    }, 
    created: {
        type: Date,
        required: true,
        default: Date.now
    }

})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article