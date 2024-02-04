const mongoose = require("mongoose");
require("dotenv").config();

// connect a conversion-table database with this project
const dbURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@conversion-table.snruosp.mongodb.net/`;

mongoose.connect(dbURL)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

