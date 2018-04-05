
require('dotenv').load();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function userAuthHandler(req, res, next) {
    return User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) return res.status(401).json({
                message: 'Invalid Credentials'
            });
            return user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) return res.status(401).json({
                    message: 'Invalid Credentials'
                })
                const token = jwt.sign({ username: user.username }, SECRET_KEY, {
                    expiresIn: 60 * 60
                });
                return res.json({ message: 'Authenticated!', token });
            })
        })
        .catch(err => next(err));
}

function getToken(req, res, next) {
    const queryToken = req.query.token;
    const headerToken = req.headers.Authorization && req.headers.Authorization.split(' ')[1];
    const token = queryToken || headerToken;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, SECRET_KEY, (err, isDecoded) => {
        if (err) res.json({ message: 'Invalid Token' });
        req.decoded = isDecoded;
        return next();
    })
}

module.exports = {
    userAuthHandler,
    getToken
};