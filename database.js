const mongoose = require("mongoose");
const connectDB = () => {
    mongoose.connect("mongodb://root:example@localhost:27017/User?authSource=admin")
        .then(() => console.log("Connected to database"))
        .catch((error) => console.log("Error in connecting to database:", error));
};

module.exports = connectDB;