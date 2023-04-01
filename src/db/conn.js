const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Manthan6296:Mkp-6296@cluster0.yysjuox.mongodb.net/Registration_DB"
  )
  .then(function () {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB" + err);
  });

