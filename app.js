const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const app = express();
const PORT = 3017;

const { usersRouter } = require('./routes');
const { userAuthHandler, getToken } = require('./handlers');

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use('/users', usersRouter);

app.get('/', (req, res, next) => {
    return res.redirect('/users');
});

app.post('/user-auth', userAuthHandler);
app.use('/users/:username', getToken);

app.use((error, req, res, next) => {
    return res.status(error.status || 500)
        .send(error.message || "Something went wrong!");
});

app.listen(PORT, () => {
    console.log("Server has started on port 3017");
});


