// requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");

const app = express();

require("./db/conn");
const UserCollection = require("./models/users");
const { json } = require("express");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// app.use()
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.set()
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

// app.get() for /index (home) page
app.get("/", function (req, res) {
  res.render("index");
});

// app.get() for /aboutmk page
app.get("/aboutmk", function (req, res) {
  res.render("aboutmk");
});

// app.get() for /register page
app.get("/register", function (req, res) {
  res.render("register");
});

// app.get() for /login page
app.get("/login", function (req, res) {
  res.render("login");
});

// app.post() for /register page
app.post("/register", async function (req, res) {
  try {
    const userPassword = req.body.password;
    const userConfirmPassword = req.body.confirmPassword;

    if (userPassword === userConfirmPassword) {
      const registerUser = new UserCollection({
        dbName: req.body.name,
        dbEmail: req.body.email,
        dbPassword: userPassword,
        dbConfirmPassword: userConfirmPassword,
      });

      const registered = await registerUser.save();
      res.status(201).render("login");
    } else {
      res.send("<h1>Passwords are not matching</h1>");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// app.post() for /login page :
app.post("/login", async function (req, res) {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const findEmail = await UserCollection.findOne({ dbEmail: userEmail });

    if (findEmail.dbPassword === userPassword) {
      res.status(201).render("aboutmk");
    } else {
      res.send("<h1>Invalid Login Credentials! Please Try Again</h1>");
    }
  } catch (error) {
    res.status(400).send("<h1>Invalid Credentials! Please Try Again</h1>");
  }
});

// app.listen()
app.listen(port, function (req, res) {
  console.log(`Server running on port: ${port}`);
});
