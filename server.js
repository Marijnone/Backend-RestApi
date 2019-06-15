const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line one-var
require('dotenv').config();
const User = require('./models/user');
const routes = require('./routes/index.js');

const router = express.Router(); // adding this for the login
const port = process.env.PORT || 3000;
const app = express();

// basic express config
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', 'views');
app.listen(port);

// use the routes from the routes/index.js file
app.use('/', routes);
