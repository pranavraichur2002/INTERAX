const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Forum1 = require('../models/forum1');
const Forum2 = require('../models/forum2');
const Forum3 = require('../models/forum3');
const unverifiedUsers = require('../models/unverifiedUsers');
const passwordRequests = require('../models/passwordRequests');

const { v4: uuidv4 } = require('uuid');

const transport = nodemailer.createTransport(
    {
        service: 'hotmail',
        auth: {
            user: process.env.TRANSPORTER_EMAIL,
            pass: process.env.TRANSPORTER_EMAIL_PASSWORD
        }
    }
);

const verifyCreds = async (userId, username, email, year) => {
    console.log("Verifying userCreds");
    return User.findOne({ userId: userId })
        .then(userData => {
            if (!userData) {
                throw "Invalid userCreds";
            }
            if (userData.username !== username || userData.email !== email || userData.year !== year) {
                throw "Invalid userCreds";
            }
            return Promise.resolve();
        })
        .catch(err => {
            return Promise.reject();
        })
}

const getTime = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return time;
}

exports.getHomePage = (req, res, next) => {
    return res.status(200).json({ msg: "hello" });
}

exports.getIsUserAuth = (req, res, next) => {
    res.status(200).json({ auth: true, msg: "Authenticated user" });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("From login ");
    console.log("email: ", email);

    if (email === '' || password === '') {
        return res.json({ success: false, msg: 'Enter valid inputs' });
    }

    User.findOne({ email: email })
        .then(userData => {
            if (!userData) {
                console.log("No such user exists");
                return res.json({ success: false, msg: 'No such user exists' });
            }
            if (userData.password !== password) {
                return res.json({ success: false, msg: 'Wrong credentials' });
            }
            console.log("username and password matched ");
            const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, {  // change jwtSecret 
                expiresIn: 900
            });
            return res.json({ success: true, token: token, msg: "Successfull logged in", user: { username: userData.username, email: userData.email, year: userData.year, userId: userData.userId } }); // Other things as well
        })
        .catch(err => {
            console.log("Error while performing login ", err);
            return res.json({ success: false, msg: "Error while performing login" });
        })
}

exports.postSignUp = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const year = req.body.year;
    const code = req.body.code;
    if (password.length < 10 || /\S+@\S+\.\S+/.test(email) === false || code === "" || email.includes("@rvce.edu.in") === false) {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }
    const username = email.split('.')[0];
    User.findOne({ $or: [{ username: { $eq: username } }, { email: { $eq: email } }] }) // Either username or email already exists
        .then(userData => {
            if (userData) { // If user already exists 
                console.log("User already exists ");
                return res.json({ success: false, msg: "User already exists" });
            }
            else    // Create user 
            {
                console.log("Attempting to create a new user");

                unverifiedUsers.findOne({ $and: [{ username: { $eq: username } }, { email: { $eq: email } }] }) // Finding such a user in unverifiedUsers 
                    .then(unverifiedUserData => {
                        if (unverifiedUserData.code !== code) {
                            return res.json({ success: false, msg: "Invalid code" });
                        }
                        if (((new Date()).getTime() / 1000) - parseInt(unverifiedUserData.time) >= 300) // Check for code expiry 
                        {
                            unverifiedUsers.findOneAndDelete({ username: username })
                                .then(result => {

                                })
                                .catch(err => {
                                    console.log("Deleted ", username, " from unverifiedUsers");
                                })
                            return res.json({ success: false, msg: "Code expired, restart sign up process" });
                        }
                        const user = new User({ // If code valid, create user
                            userId: uuidv4(),
                            username: username,
                            password: password,
                            email: email,
                            year: year,
                            revealIdentity: false
                        });
                        user.save()
                            .then(result => {   // User created
                                console.log("User created ", username);
                                unverifiedUsers.findOneAndDelete({ username: username })
                                    .then(result => {

                                    })
                                    .catch(err => {
                                        console.log("Deleted ", username, "from unverifiedUsers");
                                    })
                                return res.json({ success: true, msg: "User created", user: { username: username, email: email, year: year } });
                            })
                            .catch(err => {
                                console.log("Error while creating user ", err);
                                return res.json({ success: false, msg: "Error while creating user" });
                            })
                    })
                    .catch(err => {
                        console.log("Error finding user");
                        return res.json({ success: false, msg: "Error finding user" });
                    })
            }
        })
        .catch(err => {
            console.log("Error while finding/creating user ", err);
            return res.json({ success: false, msg: "Error while finding/creating user" });
        })
}

exports.getForum = (req, res, next) => {
    console.log("Req for forum data")
    let posts = [[], [], []];
    Forum1.find()   // Fetch forum1 posts 
        .then(result1 => {
            console.log("fetching posts ", result1);
            posts[0] = result1;
            for (let i = 0; i < posts[0].length; i++) {
                posts[0][i].userId = 'Unavailable';
            }
            Forum2.find()   // Now fetch forum2 posts
                .then(result2 => {
                    console.log("fetching posts ", result2);
                    posts[1] = result2;
                    for (let i = 0; i < posts[1].length; i++) {
                        posts[1][i].userId = 'Unavailable';
                    }
                    Forum3.find()
                        .then(result3 => {
                            console.log("fetching posts ", result3);
                            posts[2] = result3;
                            for (let i = 0; i < posts[2].length; i++) {
                                posts[2][i].userId = 'Unavailable';
                            }
                            return res.json({ success: true, posts: posts });
                        })
                        .catch(err => {
                            console.log("Error fetching posts ", err);
                            return res.json({ success: false, msg: "Error fetching posts" });
                        })
                })
                .catch(err => {
                    console.log("Error fetching posts ", err);
                    return res.json({ success: false, msg: "Error fetching posts" });
                })
        })
        .catch(err => {
            console.log("Error fetching posts ", err);
            return res.json({ success: false, msg: "Error fetching posts" });
        })
}

exports.postForum = (req, res, next) => {
    const username = req.body.username;
    const title = req.body.title;
    const body = req.body.body;
    const email = req.body.email;
    const year = req.body.year;
    const category = req.body.category;
    const userId = req.body.userId;
    const anonymous = req.body.anonymous;
    let post;

    if (title.length < 5 || body.length < 10) {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }

    if (category === '1st Cat') { // Change these categories Later
        post = new Forum1({ postId: uuidv4(), userId: userId, title: title, body: body, username: (anonymous ? "Anonymous" : username), email: (anonymous ? "Email" : email), year: year, category: category, answers: [], upvotes: [], time: getTime() }); // reveal Identity
    }
    else if (category === '2nd Cat') {
        post = new Forum2({ postId: uuidv4(), userId: userId, title: title, body: body, username: (anonymous ? "Anonymous" : username), email: (anonymous ? "Email" : email), year: year, category: category, answers: [], upvotes: [], time: getTime() });
    }
    else if (category === '3rd Cat') {
        post = new Forum3({ postId: uuidv4(), userId: userId, title: title, body: body, username: (anonymous ? "Anonymous" : username), email: (anonymous ? "Email" : email), year: year, category: category, answers: [], upvotes: [], time: getTime() });
    }
    verifyCreds(userId, username, email, year)
        .then(result => {
            post.save()
                .then(result => {
                    console.log("Post created");
                    return res.json({ success: true, msg: "Post created" });
                })
                .catch(err => {
                    console.log("Error creating post ", err);
                    return res.json({ success: false, msg: "Error creating post" });
                })
        })
        .catch(err => {
            console.log("User creds are invalid ", err);
            return res.json({ success: false, msg: "User creds are invalid" })
        })

}

exports.postAnswer = (req, res, next) => {
    const username = req.body.username;
    const answer = req.body.answer;
    const email = req.body.email;
    const year = req.body.year;
    const userId = req.body.userId;
    const postId = req.body.postId; // Extra id for update function to work 
    const category = req.body.category;
    console.log("post req for posting answer req body => ", req.body);

    if (answer === "") {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }

    if (category === '1st Cat') {
        verifyCreds(userId, username, email, year).
            then(result => {
                Forum1.findOne({ postId: postId }).then(post => {
                    console.log("post with matching id in forum1 ", post);
                    post.answers.push({ username: username, answer: answer });
                    return post.save();
                })
                    .then(result => {
                        console.log("Answer posted in 1st Cat");
                        return res.json({ success: true, msg: "Answer posted" });
                    })
                    .catch(err => {
                        console.log("Error posting the answer ", err);
                        return res.json({ success: false, msg: "Error posting the answer" });
                    })
            })
            .catch(err => {
                console.log("User creds are invalid ", err);
                return res.json({ success: false, msg: "User creds are invalid" })
            })
    }
    else if (category === '2nd Cat') {
        verifyCreds(userId, username, email, year).
            then(result => {
                Forum2.findOne({ postId: postId }).then(post => {
                    console.log("post with matching id in forum2 ", post);
                    post.answers.push({ username: username, answer: answer });
                    return post.save();
                })
                    .then(result => {
                        console.log("Answer posted in 2nd Cat");
                        return res.json({ success: true, msg: "Answer posted" });
                    })
                    .catch(err => {
                        console.log("Error posting the answer ", err);
                        return res.json({ success: false, msg: "Error posting the answer" });
                    })
            })
            .catch(err => {
                console.log("User creds are invalid ", err);
                return res.json({ success: false, msg: "User creds are invalid" })
            })
    }
    else if (category === '3rd Cat') {
        verifyCreds(userId, username, email, year).
            then(result => {
                Forum3.findOne({ postId: postId }).then(post => {
                    console.log("post with matching id in forum3 ", post);
                    post.answers.push({ username: username, answer: answer });
                    return post.save();
                })
                    .then(result => {
                        console.log("Answer posted in 1st Cat");
                        return res.json({ success: true, msg: "Answer posted" });
                    })
                    .catch(err => {
                        console.log("Error posting the answer ", err);
                        return res.json({ success: false, msg: "Error posting the answer" });
                    })
            })
            .catch(err => {
                console.log("User creds are invalid ", err);
                return res.json({ success: false, msg: "User creds are invalid" })
            })
    }
}

exports.getYourPosts = (req, res, next) => {
    console.log("Req body for your posts ", req.body);
    const username = req.body.username;
    const userId = req.body.userId;
    const email = req.body.email;
    const year = req.body.year;
    let posts = [], yourPosts = [];
    verifyCreds(userId, username, email, year)
        .then(result => {
            Forum1.find()   // Fetch forum1 posts 
                .then(result1 => {
                    posts = posts.concat(result1);
                    Forum2.find()   // Now fetch forum2 posts
                        .then(result2 => {
                            posts = posts.concat(result2);
                            Forum3.find()
                                .then(result3 => {
                                    posts = posts.concat(result3);
                                    for (let i = 0; i < posts.length; i++) {
                                        if (posts[i].userId === userId) {
                                            yourPosts.push(posts[i]);
                                        }
                                    }
                                    yourPosts.reverse();
                                    console.log("Sending your posts", yourPosts);
                                    return res.json({ success: true, posts: yourPosts });
                                })
                                .catch(err => {
                                    console.log("Error fetching your posts ", err);
                                    return res.json({ success: false, msg: "Error fetching your posts" });
                                })
                        })
                        .catch(err => {
                            console.log("Error fetching your posts ", err);
                            return res.json({ success: false, msg: "Error fetching your posts" });
                        })
                })
                .catch(err => {
                    console.log("Error fetching your posts ", err);
                    return res.json({ success: false, msg: "Error fetching your posts" });
                })
        })
        .catch(err => {
            console.log("User creds are invalid ", err);
            return res.json({ success: false, msg: "User creds are invalid" })
        })
}


exports.postUpvote = (req, res, next) => {
    const userId = req.body.userId;
    const username = req.body.username;
    const year = req.body.year;
    const email = req.body.email;
    const postId = req.body.postId;
    const category = req.body.category;
    console.log("req for upvoting a post ", req.body);
    let flag = -1;
    if (category === '1st Cat') {
        verifyCreds(userId, username, email, year).
            then(result => {
                Forum1.findOne({ postId: postId }).then(post => {
                    console.log("post with matching id in forum1 ", post);
                    for (let i = 0; i < post.upvotes.length; i++) {
                        if (post.upvotes[i] === username) {
                            console.log("User has already upvoted");
                            flag = i;
                        }
                    }
                    if (flag === -1) {
                        post.upvotes.push(username);
                    }
                    console.log("After upvoting/not ", post.upvotes);
                    return post.save();
                })
                    .then(result => {
                        if (flag === -1) {
                            console.log("Post upvoted in cat 1");
                            return res.json({ success: true, msg: "Post upvoted" });
                        }
                        else {
                            console.log("Post already upvoted in cat 1");
                            return res.json({ success: true, msg: "Post already upvoted" });
                        }
                    })
                    .catch(err => {
                        console.log("Error upvoting the post", err);
                        return res.json({ success: false, msg: "Error upvoting the post" });
                    })
            })
            .catch(err => {
                console.log("User creds are invalid ", err);
                return res.json({ success: false, msg: "User creds are invalid" })
            })
    }
    else if (category === '2nd Cat') {
        verifyCreds(userId, username, email, year).
            then(result => {
                Forum2.findOne({ postId: postId }).then(post => {
                    console.log("post with matching id in forum2 ", post);
                    for (let i = 0; i < post.upvotes.length; i++) {
                        if (post.upvotes[i] === username) {
                            console.log("User has already upvoted");
                            flag = i;
                        }
                    }
                    if (flag === -1) {
                        post.upvotes.push(username);
                    }
                    console.log("After upvoting/not ", post.upvotes);
                    return post.save();
                })
                    .then(result => {
                        if (flag === -1) {
                            console.log("Post upvoted in cat 2");
                            return res.json({ success: true, msg: "Post upvoted" });
                        }
                        else {
                            console.log("Post already upvoted in cat 2");
                            return res.json({ success: true, msg: "Post already upvoted" });
                        }
                    })
                    .catch(err => {
                        console.log("Error upvoting the post", err);
                        return res.json({ success: false, msg: "Error upvoting the post" });
                    })
            })
            .catch(err => {
                console.log("User creds are invalid ", err);
                return res.json({ success: false, msg: "User creds are invalid" })
            })
    }
    else if (category === '3rd Cat') {
        verifyCreds(userId, username, email, year).
            then(result => {
                Forum3.findOne({ postId: postId }).then(post => {
                    console.log("post with matching id in forum3 ", post);
                    for (let i = 0; i < post.upvotes.length; i++) {
                        if (post.upvotes[i] === username) {
                            console.log("User has already upvoted");
                            flag = i;
                        }
                    }
                    if (flag === -1) {
                        post.upvotes.push(username);
                    }
                    console.log("After upvoting/not ", post.upvotes);
                    return post.save();
                })
                    .then(result => {
                        if (flag === -1) {
                            console.log("Post upvoted in cat 3");
                            return res.json({ success: true, msg: "Post upvoted" });
                        }
                        else {
                            console.log("Post already upvoted in cat 3");
                            return res.json({ success: true, msg: "Post already upvoted" });
                        }
                    })
                    .catch(err => {
                        console.log("Error upvoting the post", err);
                        return res.json({ success: false, msg: "Error upvoting the post" });
                    })
            })
            .catch(err => {
                console.log("User creds are invalid ", err);
                return res.json({ success: false, msg: "User creds are invalid" })
            })
    }
}

exports.postCheckAuth = (req, res, next) => {
    return res.json({ success: true, msg: "Successfully Authenticated" });
}

exports.postSendCode = (req, res, next) => {

    const email = req.body.email;
    const year = req.body.year;

    const code = uuidv4();

    if (/\S+@\S+\.\S+/.test(email) === false || year === "" || email.includes("@rvce.edu.in") === false) {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }

    const username = email.split('.')[0];

    var mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: email,
        subject: 'Code for your signup',
        text: `Your code: ${code}, expires in 5 minutes`,
        html: `<h4> Your code: ${code}, expires in 5 minutes </h4>`
    }

    User.findOne({ $or: [{ username: { $eq: username } }, { email: { $eq: email } }] }) // Either username or email already exists
        .then(userData => {
            if (userData) { // If user already exists 
                console.log("User already exists ");
                return res.json({ success: false, msg: "User already exists" });
            }
            // Check if it already exits unverifiedUsers, so that signup 'findOneAndDelete' functionality works
            unverifiedUsers.findOneAndDelete({ username: username })
                .then(result => {
                    const unverifiedUser = new unverifiedUsers({
                        username: username,
                        email: email,
                        year: year,
                        code: code,
                        time: (new Date()).getTime() / 1000
                    });
                    unverifiedUser.save()
                        .then(result => {
                            transport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log("Error sending mail");
                                    return res.json({ success: false, msg: "Error sending mail" });
                                }
                                return res.json({ success: true, msg: "Code sent to your email" });
                            })
                        })
                        .catch(err => {
                            console.log("Error sending code ", err);
                            return res.json({ success: false, msg: "Error sending code" });
                        })
                })
                .catch(err => {
                    console.log("Error finding and deleting in unverifiedUsers ", err);
                    return res.json({ success: false, msg: "Error sending code" });
                })

        })
        .catch(err => {
            console.log("Error checking if user already exits ", err);
            return res.json({ success: false, msg: "Error checking if user already exits" });
        })
}


exports.postForgotPassword = (req, res, next) => {
    const email = req.body.email;
    const code = uuidv4();

    if (/\S+@\S+\.\S+/.test(email) === false || email.includes("@rvce.edu.in") === false) {

        return res.json({ success: false, msg: "Enter valid inputs" });
    }

    User.findOne({ email: email })
        .then((userData) => {    // Can just use split string for username here
            if (!userData) {
                return res.json({ success: false, msg: "Unregistered user" });
            }
            const username = userData.username;
            console.log("Username ", username);
            passwordRequests.findOneAndDelete({ email: email })// Check if it already exits in passwordRequests, so that changePassword 'findOneAndDelete' functionality works 
                .then(result => {
                    const passwordRequest = new passwordRequests({
                        username: username,
                        email: email,
                        requestId: code,
                        time: (new Date()).getTime() / 1000
                    })

                    passwordRequest.save()
                        .then(result => {
                            var mailOptions = {
                                from: process.env.TRANSPORTER_EMAIL,
                                to: email,
                                subject: 'Password reset instructions',
                                text: `Your Request ID: ${code}, expires in 5 minutes \n Visit https://interax.netlify.app/changePassword to proceed`, // Change link later
                                html: ` <h3>Hey ${username},</h3>
                                        <h4> Your password reset Request ID: ${code}, expires in 5 minutes </h4> 
                                        <p><a href='https://interax.netlify.app/changePassword'>Click here to proceed </a></p>
                                      `
                            }
                            transport.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log("Error sending mail ", err);
                                    return res.json({ success: false, msg: "Error sending mail" });
                                }
                                return res.json({ success: true, msg: "Instructions sent to your mail" });
                            })
                        })
                        .catch(err => {
                            console.log("Error sending mail", err);
                            return res.json({ success: false, msg: "Error sending mail" });
                        })
                })
                .catch(err => {
                    console.log("Error finding in passwordRequests and deleting ", err);
                    return res.json({ success: false, msg: "Error requesting password change" });
                })

        })
        .catch(err => {
            console.log("Error finding user email ", err);
            return res.json({ success: false, msg: "Error finding user email" });
        })
}


exports.postChangePassword = (req, res, next) => {
    const requestId = req.body.reqId;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword || requestId === "" || password.length < 10) {
        return res.json({ success: false, msg: "Enter valid inputs" });
    }

    passwordRequests.findOne({ requestId: requestId })
        .then(passwordRequestData => {
            if (!passwordRequestData) {
                return res.json({ success: false, msg: "Invalid request ID" });
            }

            if ((new Date()).getTime() / 1000 - parseInt(passwordRequestData.time) >= 300) {    // Request ID expired
                passwordRequests.findOneAndDelete({ requestId: requestId })
                    .then(result => {

                    })
                    .catch(err => {
                        console.log("Error deleting request ID since it has expired ", err);
                    })
                return res.json({ success: false, msg: "Request ID has expired" });
            }

            User.findOne({ email: passwordRequestData.email })
                .then(userData => {
                    userData.password = password;
                    return userData.save();
                })
                .then(result => {
                    passwordRequests.findOneAndDelete({ requestId: requestId })
                        .then(result => {

                        })
                        .catch(err => {
                            console.log("Error deleting request ID since password has been changed ", err);
                        })
                    return res.json({ success: true, msg: "Password has been reset" });
                })
                .catch(err => {
                    console.log("Error changing password ", err);
                    return res.json({ success: false, msg: "Error changing password" });
                })
        })
        .catch(err => {
            console.log("Error changing password ", err);
            return res.json({ success: false, msg: "Error changing password" });
        })
}

exports.postDeletePost = (req, res, next) => {
    const username = req.body.username;
    const userId = req.body.userId;
    const email = req.body.email;
    const year = req.body.year;
    const category = req.body.category;
    const postId = req.body.postId;
    console.log("Req made to delete post ");
    verifyCreds(userId, username, email, year)
        .then(result => {
            if (category === '1st Cat') {
                Forum1.findOneAndDelete({ postId: postId })
                    .then(result => {
                        return res.json({ success: true, msg: "Post deleted" });
                    })
                    .catch(err => {
                        console.log("Error deleting post");
                        return res.json({ success: false, msg: "Error deleting post" });
                    })
            }
            else if (category === '2nd Cat') {
                Forum2.findOneAndDelete({ postId: postId })
                    .then(result => {
                        return res.json({ success: true, msg: "Post deleted" });
                    })
                    .catch(err => {
                        console.log("Error deleting post");
                        return res.json({ success: false, msg: "Error deleting post" });
                    })
            }
            else if (category === '3rd Cat') {
                Forum3.findOneAndDelete({ postId: postId })
                    .then(result => {
                        return res.json({ success: true, msg: "Post deleted" });
                    })
                    .catch(err => {
                        console.log("Error deleting post");
                        return res.json({ success: false, msg: "Error deleting post" });
                    })
            }
        })
        .catch(err => {
            console.log("User creds are invalid ", err);
            return res.json({ success: false, msg: "User creds are invalid" });
        })
}
