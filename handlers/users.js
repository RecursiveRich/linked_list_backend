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

}

function updateUser(req, res, next) {

}

function deleteUser(req, res, next) {

}


module.exports = {
    getUsers,       // GET to /users
    createUser,     // POST to /users
    getUser,        // GET to /users/${username} Auth
    updateUser,     // PATCH to /users/${username} Auth + Correct User
    deleteUser      // DELETE to /users/${username} Auth + Correct User
};