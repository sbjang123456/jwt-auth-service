const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const { stream } = require('./config/winston')();

const app = express();
require('./docs/swagger')(app);

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extends: false }));
app.use(
    morgan(process.env.NODE_ENV !== "production" ? "dev" : "combined", {
        skip: (req, res) => { return res.statusCode < 400 },
        stream
    })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
    next();
});

app.use(routes);

app.use((req, res, next) => {
    res.statusCode = 404;
    next(Error('not found'));
});

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        result: false,
        error: err.message || 'internal server error'
    });
});

module.exports = app;