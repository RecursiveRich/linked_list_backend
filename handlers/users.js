const { User } = require('../models');

function getUsers(req, res, next) {
    return User.find()
        .then(users => {
            let rsp = { data: users };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function createUser(req, res, next) {
    return User.create(req.body)
        .then(user => {
            let rsp = { data: user };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function getUser(req, res, next) {
    return User.findOne({ username: req.params.username })
        .then(user => {
            let rsp = { data: user };
            return res.json(rsp);
        })
        .catch(err => {
            return res.json(err);
        })
}

function updateUser(req, res, next) {
    return User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true })
        .then(user => {
            let rsp = { data: user };
            return res.json(rsp);
        })
        .catch(err => res.json(err));
}

function deleteUser(req, res, next) {
    return User.findOneAndRemove({ username: req.params.username })
        .then(user => {
            let rsp = {
                title: 'Success',
                message: "The delete operation was successful"
            };
            return res.json(rsp);
        })
}


module.exports = {
    getUsers,       // GET to /users
    createUser,     // POST to /users
    getUser,        // GET to /users/${username} Auth
    updateUser,     // PATCH to /users/${username} Auth + Correct User
    deleteUser      // DELETE to /users/${username} Auth + Correct User
};