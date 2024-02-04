const mongoose = require("mongoose");
require("dotenv").config();

// connect a conversion-table database with this project

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectMongoDB;

