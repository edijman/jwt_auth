const { boolean } = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        min: 2
    },
    lastName: {
        type: String,
        require: true,
        min: 2
    },
    email: {
        type: String,
        require: true,
        max: 255, 
        min: 6
    },
    password: {
        type: String,
        required: true, 
        max: 1024, 
        min: 6
    }, 
    date: {
        type: Date,
        default: Date.now
    }, 
    confirmed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)