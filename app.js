const express = require('express');
// body-parser here or in handlers?
const bodyParser = require('body-parser');
const morgan = require('morgan');
// ditto
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;

const { usersRouter } = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use('/users', usersRouter);

app.get('/', (req, res, next) => {
    // Change to /login once that route is created
    return redirect('/users');
});

app.use((error, req, res, next) => {
    return res.status(err.status || 500)
        .send(error.message || "Something went wrong!");
});

app.listen(PORT, () => {
    console.log("Server has started on port 3000");
});

