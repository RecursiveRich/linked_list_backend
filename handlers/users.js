const mongoose = require('mongoose');
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
    // added .data
    return User.create(req.body.data)
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
    var oldCompanyId;
    var userId;
    var username;
    var user1;
    return User.findOne({ username: req.params.username })
        .then(user => {
            oldCompanyId = user.currentCompanyId;
            userId = user._id;
            username = user.username;
            // added .data
            return user.update(req.body.data);
        })
        .then(queryData => {
            return mongoose.model('Company').findByIdAndUpdate(oldCompanyId, { $pull: { employees: username } })
        })
        .then(oldCompany => {
            return User.findById(userId);
        })
        .then(user => {
            user1 = user;
            return mongoose.model('Company').findByIdAndUpdate(user.currentCompanyId, { $addToSet: { employees: username } })
        })
        .then(newCompany => {
            let rsp = { data: user1 };
            return res.json(rsp);
        })
        .catch(e => next(e));
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