const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/mongotest', function(err, db) {
        console.log('Connected to MongoDB!');

        db.close();
});
