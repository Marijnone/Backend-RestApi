const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// here i am getting the authorization token from the header
// and then im replaceing the Bearer part with nothing
const auth = async (req, res, next) => {
        try {
                const token = req.header('Authorization').replace('Bearer', '');
                const decoded = jwt.verify(token, 'process.env.SESSION_SECRET');
                const user = await User.findOne({ _id: decoded_id });
                console.log(token);
        } catch (e) {
                res.status(401).send({ error: 'Please authenicate' });
        }
};

module.exports = auth;
