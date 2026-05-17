const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Mock User Database
const users = [];

// Passport Configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = users.find((u) => u.username === username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = users.find((u) => u.username === username);
  done(null, user);
});

// Auth Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<h1>Home</h1><p>Welcome back, ${req.user.username}!</p><a href="/profile">Profile</a> | <a href="/logout">Logout</a>`,
    );
  } else {
    res.send(
      '<h1>Home</h1><p>Please login</p><a href="/login">Login</a> | <a href="/register">Register</a>',
    );
  }
});

app.get("/register", (req, res) => {
  res.send(
    '<h1>Register</h1><form action="/register" method="POST"><input type="text" name="username" placeholder="Username" required /><input type="password" name="password" placeholder="Password" required /><button type="submit">Register</button></form>',
  );
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.send(
    '<h1>Login</h1><form action="/login" method="POST"><input type="text" name="username" placeholder="Username" required /><input type="password" name="password" placeholder="Password" required /><button type="submit">Login</button></form>',
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);

app.get("/profile", ensureAuthenticated, (req, res) => {
  res.send(
    `<h1>Profile</h1><p>Username: ${req.user.username}</p><a href="/">Home</a>`,
  );
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
