const express = require("express");
const connectDB = require("./database");
const app = express();
app.use(express.json());
const User = require("./models/User");
const PORT = 3000;
const { validationResult } = require("express-validator");
const { loginValidator } = require("./validator");



const parseErrors = (errors) => {
    const errorObject = {};
    errors.array().forEach((err) => {
        const path = err.path; 
        if (!errorObject[path]) {
            errorObject[path] = err.msg;
        }
    });
    return errorObject;
};


app.post("/user", loginValidator, async (req, res) => {
    console.log("I'm here.............................................");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const parsedErrors = parseErrors(errors);
        return res.status(400).json({ errors: parsedErrors }); 
    }
    try {
        const { name, mobileNumber, email, age, gender, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ name, mobileNumber, email, age, gender, password });
        await newUser.save();
        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "User already exists." });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});