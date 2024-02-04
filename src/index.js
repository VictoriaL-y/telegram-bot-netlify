const mongoose = require("mongoose");
require("dotenv").config();

// connect a conversion-table database with this project

const connectMongoDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
}

connectMongoDB()
    .catch((err) => console.error(err));

module.exports = connectMongoDB;

