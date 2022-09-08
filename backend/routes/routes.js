const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const controllers = require('../controllers/controllers');

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.json({ success: false, msg: "Token needed" });
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({ success: false, msg: "failed to authenticate" });
            }
            req.userId = decoded.id;
            next();
        })
    }
}

router.post('/deletePost', controllers.postDeletePost);

router.post('/changePassword', controllers.postChangePassword);

router.post('/forgotPassword', controllers.postForgotPassword);

router.post('/sendCode', controllers.postSendCode);

router.post('/upvote', verifyJWT, controllers.postUpvote);

router.post('/yourPosts', verifyJWT, controllers.getYourPosts);

router.post('/answer', verifyJWT, controllers.postAnswer);

router.post('/postForum', verifyJWT, controllers.postForum);

router.get('/forum', verifyJWT, controllers.getForum);

router.get('/isUserAuth', verifyJWT, controllers.getIsUserAuth);    // checking 

router.post('/checkAuth', verifyJWT, controllers.postCheckAuth); // Just to check if user is auth 

router.post('/login', controllers.postLogin);

router.post('/signup', controllers.postSignUp);

router.get('/', controllers.getHomePage);

module.exports = router; 