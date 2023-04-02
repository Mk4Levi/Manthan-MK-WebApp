//
// requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

// const mongoose = require("mongoose");

// mongoose
//   .connect(
//     "mongodb+srv://Manthan6296:Mkp-6296@cluster0.yysjuox.mongodb.net/Registration_DB"
//   )
//   .then(function () {
//     console.log("Successfully connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log("Could not connect to MongoDB" + err);
//   });

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

// app.get() for /home page
app.get("/about", function (req, res) {
  res.render("about");
});

// app.get() for /registration page
app.get("/registration", function (req, res) {
  res.render("registration");
});

// app.get() for /login page
app.get("/login", function (req, res) {
  res.render("login");
});

// app.post() for /registration page
app.post("/registration", async function (req, res) {
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
      res.send("Passwords are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// app.post() for /login page
app.post("/login", async function (req, res) {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const findEmail = await UserCollection.findOne({ dbEmail: userEmail });

    if (findEmail.dbPassword === userPassword) {
      res.status(201).render("about");
    } else {
      res.send("Invalid Login Details");
    }
  } catch (error) {
    res.status(400).send("Invalid Details");
  }
});

// app.listen()
app.listen(port, function (req, res) {
  console.log(`Server running on port: ${port}`);
});
