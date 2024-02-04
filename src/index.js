const mongoose = require("mongoose");
require("dotenv").config();

// connect a conversion-table database with this project
const dbURL = `${process.env.MONGODB_URI}`;

mongoose.connect(dbURL)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

