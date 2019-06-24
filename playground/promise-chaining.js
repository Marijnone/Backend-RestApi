/* eslint-disable no-console */
require('../db/mongoose.js');
const User = require('../models/user');

// User.findByIdAndUpdate('5cbda9f9961e8405ca2163f0', { age: 1 })
//         .then(user => {
//                 console.log(user);
//                 return User.countDocuments({ age: 24 });
//         })
//         .then(result => {
//                 console.log(result);
//         })
//         .catch(e => {
//                 console.log(e);
//         });
// first try at async await this is the update function that let users change there age age is a var used before so we can use the short hand

const updateAgeAndCount = async (id, age) => {
        const user = await User.findByIdAndUpdate(id, { age });
        const count = await User.countDocuments({ age });
        return count;
};
updateAgeAndCount('5cbdc26ecc09630ab31a6375', 24)
        .then(count => {
                console.log(count);
        })
        .catch(e => {
                console.log(e);
        });
