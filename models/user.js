const mongoose = require('mongoose');
require('dotenv').config();
const validator = require('validator');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
        name: {
                type: String,
                trim: true,
                required: true,
        },

        password: {
                type: String,
                required: true,
                trim: true,
                minlength: 7,
                // lowercase: true, //this made bcrypt not work because the hash in not lower case duuu
                validate(value) {
                        if (value.toLowerCase().includes('password'))
                                throw new Error('Password cannot contain password, come on');
                },
        },
        age: {
                type: Number,
                default: 0,
                validate(value) {
                        if (value < 0) {
                                throw new Error('Age must be a postive number');
                        }
                },
        },
        email: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                validate(value) {
                        if (!validator.isEmail(value)) {
                                throw new Error('Email is invalid');
                        }
                },
        },
        tokens: [
                {
                        token: {
                                type: String,
                                required: true,
                        },
                },
        ],
});
// here we create a jwt token add it to the array from the schema
// and then call user.save to save it to the db
userSchema.methods.generateAuthToken = async function() {
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() }, 'process.env.SESSION_SECRET');

        user.tokens = user.tokens.concat({ token });
        await user.save();
        return token;
};

// checking if the user is able to login using moongoose methods
// is the password is a match we return the user if not we throw an error
userSchema.statics.findByCredentials = async (email, password) => {
        const user = await User.findOne({ email });

        if (!user) {
                throw new Error('Unable to login');
        }

        const isMatch = await bycrypt.compare(password, user.password);

        if (!isMatch) {
                throw new Error('Unable to login');
        }

        return user;
};
// here we want to perform some opperation before the user registers
// then hash it with bycrpyt
userSchema.pre('save', async function(next) {
        const user = this;
        if (user.isModified('password')) {
                user.password = await bycrypt.hash(user.password, 8);
        }
        next();
});

// create a schema to use mongoose middelware
const User = mongoose.model('User', userSchema);

// const SpotifyData = mongoose.model('genres', {
//         songs: {
//                 type: [],
//         },
// });

// const songs = new SpotifyData({});

// const me = new User({
//         name: 'Kees',
//         password: 'Password123',
//         age: 24,
//         email: 'kees@gmail.com',
// });
// save the instance to the database
// me.save()
//         .then(() => {
//                 console.log(me);
//         })
//         .catch(error => {
//                 console.log('Error', error);
//         });

module.exports = User;
