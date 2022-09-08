const mongoose = require('mongoose');

const Schema = mongoose.Schema

const forum3Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    username: {
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
    category: {
        type: String,
        required: true
    },
    answers: [
        {
            answer: String,
            username: String
        }
    ],
    upvotes: [
        {
            type: String
        }
    ],
    time: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('forum3', forum3Schema); 