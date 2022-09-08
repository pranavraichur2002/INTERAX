const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const routes = require('./routes/routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(routes);

mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        console.log("Connected to database");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server listening on port ...${process.env.PORT || 5000}`);
        })
    })
    .catch(err => {
        console.log("Database connection error => ", err);
    })