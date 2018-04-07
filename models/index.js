const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.set('debug', true);
mongoose
    .connect('mongodb://localhost/linked_list_db', {
        useMongoClient: true
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log(`Error connecting to DB ${err.message}`)
    });

exports.User = require('./user');
exports.Company = require('./company');
// export other models once created