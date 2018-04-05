const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
// for auth
require('dotenv').load();
const app = express();
const PORT = 3017;
// for auth
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');


const { usersRouter } = require('./routes');

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use('/users', usersRouter);

app.get('/', (req, res, next) => {
    // Change to /login once that route is created
    return res.redirect('/users');
});

app.post('/user-auth', (req, res, next) => {
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
})

app.use('/users/:username', (req, res, next) => {
    const queryToken = req.query.token;
    const headerToken = req.headers.Authorization && req.headers.Authorization.split(' ')[1];
    const token = queryToken || headerToken;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, SECRET_KEY, (err, isDecoded) => {
        if (err) res.json({ message: 'Invalid Token' });
        req.decoded = isDecoded;
        return next();
    })
})

app.use((error, req, res, next) => {
    return res.status(error.status || 500)
        .send(error.message || "Something went wrong!");
});

app.listen(PORT, () => {
    console.log("Server has started on port 3017");
});


