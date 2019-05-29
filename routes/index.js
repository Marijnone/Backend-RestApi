const express = require('express');
const bodyParser = require('body-parser');
require('../db/mongoose');

const User = require('../models/user');

const router = express.Router();

// lets make some routes

router.get('/', (req, res) => {
        res.render('welcome.ejs');
});

router.get('/login', (req, res) => {
        res.render('login.ejs');
});

// router.get('/users/register', (req, res) => {
//         res.render('users/new.ejs', { title: 'Register' });
// });

router.post('/users/register', async (req, res) => {
        const user = new User(req.body);

        try {
                await user.save();
                const token = await user.generateAuthToken();
                res.status(200).send(user, token);
        } catch (e) {
                res.status(400).send(e);
        }
});
// here we generate and sendback the token
router.post('/users/login', async (req, res) => {
        try {
                const user = await User.findByCredentials(req.body.email, req.body.password);
                const token = await user.generateAuthToken();
                res.send({ user, token });
        } catch (e) {
                res.status(500).send(e);
                console.log(e);
        }
});

router.get('/users', async (req, res) => {
        try {
                const users = await User.find({});
                res.send(users);
        } catch (e) {
                res.status(500).send();
        }
});
// if no user 404
router.get('/users/:id', async (req, res) => {
        const _id = req.params.id;

        try {
                const user = await User.findById(_id);

                if (!user) {
                        return res.status(404).send();
                }
                res.send(user);
        } catch (e) {
                res.status(500).send();
        }
});
// update the user value gets a little more difficult because some mongoose
// methods can be called without notice of the middelware, to make sure our update gets trough correctly we have to change this
// by creating a sort of guard that make sure that the updates are allowed
// its some pretty complex code in my opinion but i understand what is happening

router.patch('/users/:id', async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
                res.status(400).send({ error: 'Invalid updates this is not allowed' });
        }
        try {
                const user = await User.findById(req.params.id);
                // make the update the same as the user gives in req.body dynamic
                updates.forEach(update => (user[update] = req.body[update]));

                await User.save();
                // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

                if (!user) {
                        return res.status(404).send();
                }

                res.send(user);
        } catch (e) {
                res.status(400).send(e);
        }
});
// Delete method same logic as before if there is no user send a 404 otherwise remove the user
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
