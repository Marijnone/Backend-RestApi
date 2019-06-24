const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// here i am getting the authorization token from the header
// and then im replaceing the Bearer part with nothing
// so after that things get a little more complex
// 1. find a user with the decoded id, 2. it gonna check if the user has the token stored in one of their array items in the db
const auth = async (req, res, next) => {
        try {
                const token = req.header('Authorization').replace('Bearer ', '');

                const decoded = jwt.verify(token, 'thisismysecret');
                const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
                // console.log(token);

                if (!user) {
                        throw new Error();
                }
                // this would be the user variable
                req.user = user;
                next();
        } catch (e) {
                res.status(401).send({ error: 'Please authenticate' });
        }
};

module.exports = auth;
