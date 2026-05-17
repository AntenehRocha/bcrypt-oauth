const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Mock User Database
const users = [];

app.get('/', (req, res) => {
    res.send('<h1>Home</h1><p>Please login</p>');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
