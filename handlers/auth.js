
require('dotenv').load();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function userAuthHandler(req, res, next) {
    console.log('hit userAuthHandler')
    console.log(req.body);
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

function verifyToken(req, res, next) {
    const queryToken = req.query.token;
    const headerToken = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const token = queryToken || headerToken;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) res.json({ message: 'Invalid Token' });
        req.decoded = decoded;
        return next();
    })
}

function ensureCorrectUser(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (decoded.username !== req.params.username) return res.status(401).json({ message: "Not Authorized" });
            // REMOVE THIS LINE
            console.log('decoded: ', decoded);
            return next();
        })
    }
    catch (err) {
        return res.status(401).json({ message: "Not Authorized" });
    }
}

module.exports = {
    userAuthHandler,
    verifyToken,
    ensureCorrectUser
};