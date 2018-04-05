const { User } = require('../models');

function getUsers(req, res, next) {
    return User.find()
        .then(users => {
            return res.json(users);
        })
        .catch(err => {
            return res.error(err);
        })
}

function createUser(req, res, next) {

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