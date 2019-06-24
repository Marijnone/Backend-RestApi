const mongoose = require('mongoose');
require('dotenv').config();

const Mongourl = mongoose.connect(`mongodb+srv://marijn:${process.env.DB_PASS}@backend-vsuxs.mongodb.net/testUser`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
});

const db = mongoose.connection;

db.once('open', () => {
        console.log('Successfully connected to MongoDB using Mongoose!');
});
db.on('error', error => {
        console.log(`There is an error connection the the database: ${error}`);
});

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
