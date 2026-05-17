const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const users = [];

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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, nombre, apellidos, dni } = req.body;
    if (!username || !password || !nombre || !dni) {
      return res.redirect("/register?error=missing_fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ 
      username, 
      password: hashedPassword,
      nombre,
      apellidos,
      dni,
      favorites: [] 
    });
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register?error=server_error");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error=login_failed",
  }),
);

app.get("/api/favorites", ensureAuthenticated, (req, res) => {
  res.json(req.user.favorites || []);
});

app.post("/api/favorites", ensureAuthenticated, (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "City required" });
  
  if (!req.user.favorites) req.user.favorites = [];
  if (!req.user.favorites.includes(city)) {
    req.user.favorites.push(city);
  }
  res.json(req.user.favorites);
});

app.delete("/api/favorites", ensureAuthenticated, (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "City required" });
  
  if (req.user.favorites) {
    req.user.favorites = req.user.favorites.filter(c => c !== city);
  }
  res.json(req.user.favorites);
});

app.get("/api/user", ensureAuthenticated, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
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
