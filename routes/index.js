const express = require('express');
const bodyParser = require('body-parser');

const auth = require('../src/middleware/auth');
require('../db/mongoose');

const User = require('../models/user');

const router = express.Router();
router.use(
        bodyParser.urlencoded({
                extended: false,
        })
);

// lets make some routes

router.get('/', (req, res) => {
        res.render('welcome.ejs');
});

router.get('/users/login', (req, res) => {
        res.render('users/login.ejs');
});

router.get('/users/register', (req, res) => {
        res.render('users/new.ejs', { title: 'Register' });
});

// router.get('/users/me/edit', (req, res) => {
//         // eslint-disable-next-line no-undef
//         res.render('users/edit.ejs', { title: 'Edit', user });
// });

router.post('/users/register', async (req, res) => {
        const user = new User(req.body);

        try {
                await user.save();
                const token = await user.generateAuthToken();
                res.render('users/succes.ejs', { user, token }).status(200);
        } catch (e) {
                res.status(400).send(e);
        }
});

// we empty the array where al the sessions where stored
router.post('/users/logout', async (req, res) => {
        try {
                req.user.tokens = [];
                await req.user.save();
                res.send();
                res.render('welcome.ejs');
        } catch (e) {
                res.status(500).send();
                console.log(e);
        }
});

router.post('/users/login', async (req, res) => {
        try {
                const user = await User.findByCredentials(req.body.email, req.body.password);
                const token = await user.generateAuthToken();
                // res.send({ user, token });
                res.render('users/profile.ejs', { token, user });
        } catch (e) {
                // res.status(400).send();
                res.render('users/error.ejs', { e }).res.status(400);
        }
});

// we here add auth as a second parameter to check
// this route with middleware
// i will keep this route around a little more it maybe come in handy

// i had to remove auth because it does not work how i want it to..

router.get('/users', async (req, res) => {
        try {
                const users = await User.find({});
                // res.render('users/overview.ejs', { users });
                res.send(users);
        } catch (e) {
                res.status(500).send();
        }
});
// we now have a route that grabs the user from the auth.js file
// and it checks if the user is signed in and then shows the profile

<<<<<<< HEAD
// router.get('/users/me', async (req, res) => {
//         // eslint-disable-next-line prefer-destructuring

//         const { user } = req;
//         try {
//                 // user = req.user;
//                 res.render('users/profile.ejs', { user }).status(200);
//                 // console.log(user);
//         } catch (e) {
//                 console.log(e);
//         }
// });
=======
router.get('/users/me', auth, async (req, res) => {
        try {
                // user = req.user;
                res.send(req.user);
                console.log(user);
        } catch (e) {
                console.log(e);
        }
});
>>>>>>> parent of b360f8d... /me renders with the right data and is protected with auth :)
// res.render('profile.ejs');
// if no user 404
router.get('/users/:id', async (req, res) => {
        const _id = req.params.id;

        try {
                const user = await User.findById(_id);

                if (!user) {
                        return res.status(404).send();
                }
        } catch (e) {
                res.status(500).send();
        }
});

// update the user value gets a little more difficult because some mongoose
// methods can be called without notice of the middelware, to make sure our update gets trough correctly we have to change this
// by creating a sort of guard that make sure that the updates are allowed
// its some pretty complex code in my opinion but i understand what is happening

router.post('/users/me/edit', async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
                res.status(400).send({ error: 'Invalid updates this is not allowed' });
        }
        try {
                // make the update the same as the user gives in req.body dynamic
                updates.forEach(update => (req.user[update] = req.body[update]));

                await req.user.save();
                res.send(req.user);
                res.render('profile.ejs', { user });
        } catch (e) {
                console.log(e);
                res.status(400).send(e);
        }
});
// Delete method same logic as before if there is no user send a 404 otherwise remove the user
// added some logic to make it more secur now you cant remove a random user id!!
router.delete('/users/:id', async (req, res) => {
        try {
                const user = await User.findByIdAndDelete(req.params.id);
                if (!user) {
                        return res.status(404).send();
                }
                res.send(user);
        } catch (e) {
                res.status(500).send(e);
        }
});
module.exports = router;
