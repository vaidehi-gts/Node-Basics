const express = require("express");
const connectDB = require("./database");
const app = express();
app.use(express.json());
const User = require("./models/User");
const Joi = require("joi");
const PORT = 3000;

const emailRegex = /^[^\s@]+@gmail\.com$/i;
const phoneRegex = /^[(]?(\d{3})[)]?[-|\s]?(\d{3})[-|\s]?(\d{4})$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const parseErrors = (error) => {
    const errorObject = {};
    error.details.forEach((err) => {
        const path = err.path[0]; 
        if (!errorObject[path]) {
            errorObject[path] = err.message;
        }
    });
    return errorObject;
};

const userSignupSchema = Joi.object({
    name: Joi.string()
        .required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            "any.required": "Name is required.",
            "string.empty": "Name cannot be empty.",
            "string.pattern.base": "Name must contain letters only.",
        }),
    mobileNumber: Joi.string()
        .length(10)
        .pattern(phoneRegex)
        .required()
        .messages({
            "any.required": "Mobile number is required.",
            "string.empty": "Mobile number cannot be empty.",
            "string.length": "Mobile number must be exactly 10 digits long.",
            "string.pattern.base": "Invalid mobile number format.",
        }),
    email: Joi.string()
        .email()
        .pattern(emailRegex)
        .required()
        .messages({
            "any.required": "Email is required.",
            "string.empty": "Email cannot be empty.",
            "string.email": "Invalid email format.",
            "string.pattern.base": "Email must be a valid Gmail address.",
        }),
    age: Joi.number()
        .required()
        .min(0)
        .max(100)
        .messages({
            "any.required": "Age is required.",
            "number.base": "Age must be a number.",
            "number.min": "Age cannot be less than 0.",
            "number.max": "Age cannot be greater than 100.",
        }),
    gender: Joi.string()
        .valid("male", "female", "other")
        .required()
        .messages({
            "any.required": "Gender is required.",
            "any.only": "Gender must be 'male', 'female', or 'other'.",
        }),
    password: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.pattern.base":
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),
});

app.post("/user", async (req, res) => {
    const { error, value } = userSignupSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const parsedErrors = parseErrors(error);
        return res.status(400).json({ errors: parsedErrors });
    }

    try {
        const newUser = new User(value);
        const savedUser = await newUser.save();
        return res.status(201).json({ message: "User added successfully.", user: savedUser });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "User already exists." });
        }
        return res.status(500).json({ error: "An unexpected error occurred.", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});