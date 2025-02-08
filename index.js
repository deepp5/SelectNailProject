const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true })); //takes input
app.use(
  session({ secret: "notagoodsecret", resave: false, saveUninitialized: true })
);

const users = {}; // In-memory storage for users

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.send("Username already exists. Please choose another.");
  }
  const hash = await bcrypt.hash(password, 12);
  users[username] = hash;
  req.session.user_id = username;
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userPasswordHash = users[username];
  if (!userPasswordHash) {
    return res.redirect("/login");
  }
  const valid = await bcrypt.compare(password, userPasswordHash);
  if (valid) {
    req.session.user_id = username;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret.ejs");
});
app.post("/colorpalette", (req, res) => {
  res.render("colorpalete.ejs");
});

app.listen(4050, () => {
  console.log("Server running on port 4040");
});
