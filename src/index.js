const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());

// connect a conversion-table database with this project
const dbURL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@conversion-table.snruosp.mongodb.net/`;
mongoose.connect(dbURL)
    .then(() =>
        app.listen(PORT, (err) => {
            if (err) console.log(err);
            console.log("Server listening on Port", PORT);
        }))
    .catch((err) => console.log(err))


