const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {   //Extra id for update function to work 
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    revealIdentity: {   // CHECK THIS LATER
        type: Boolean,
        required: false
    },
})

module.exports = mongoose.model('users', userSchema); 