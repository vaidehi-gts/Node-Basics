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





// const checkValidation = (name, email, mobileNumber, gender, password) => {
//     if (name !== undefined) {
//         if (!name) throw new Error("Name cannot be empty");
//         if (/\d/.test(name)) throw new Error("Name should not contain numbers");
//     }
//     if (email !== undefined) {
//         if (!email) throw new Error("email cannot be empty");
//         if (!emailRegex.test(email)) throw new Error("Email must be a Gmail address");
//     }
//     if (mobileNumber !== undefined) {
//         if (!mobileNumber) throw new Error("mobile number is required");
//         if (!phoneRegex.test(mobileNumber)) throw new Error("Invalid mobile number format (e.g., 884-761-3472)");
//     }
//     if (gender !== undefined) {
//         if (!gender) throw new Error("gender is required");
//         if (!["other", "male", "female"].includes(gender)) {
//             throw new Error("Select a correct gender: male, female, or other");
//         }
//     }
//     if (password !== undefined) {
//         if (!password) throw new Error("password is required");
//         if (!passwordRegex.test(password)) {
//             throw new Error("Password must be at least 8 characters, with uppercase, lowercase, number, and a special character");
//         }
//     }
// };

// app.post("/user", async (req, res) => {
//     try {
//         const { name, email, mobileNumber, age, gender, password, isActive } = req.body;
//         console.log(name, email, mobileNumber, age, gender, password, isActive);
//         try {
//             checkValidation(name, email, mobileNumber, gender, password);
//         }
//         catch (validationError) {
//             return res.status(400).json({ message: validationError.message });
//         }
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "user already exists" });
//         }
//         else {
//             if (isActive) {
//                 const newUser = new User({ name, email, mobileNumber, age, gender, password, isActive });
//                 await newUser.save();
//                 return res.status(201).json({ message: "user added successfully" });
//             }
//             else {
//                 if(isActive ===  false)
//                 {
//                     return res.status(500).json({ message: "user must be active" });
//                 }
//                 return res.status(500).json({ message: "all fields are required fields cannot be empty" });
//             }
//         }
//     }
//     catch (error) {
//         return res.status(500).json({ error: "error in adding user", details: error.message });
//     }
// })

// app.get("/allUser", async (req, res) => {
//     try {
//         const getUsers = await User.find();
//         console.log(getUsers);
//         if (getUsers.length === 0) {
//             return res.status(404).json({ message: "no user exists" });
//         }
//         return res.status(200).json(getUsers);
//     }
//     catch (error) {
//         return res.status(500).json({ error: "error in getting" });
//     }
// })

// app.put("/userUpdate/:id", async (req, res) => {
//     const { id } = req.params;
//     const { name, email, mobileNumber, gender, password } = req.body;
//     try {
//         checkValidation(name, email, mobileNumber, gender, password);
//         const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: "user not found" });
//         }
//         return res.status(200).json(updatedUser);
//     }
//     catch (error) {
//         return res.status(500).json({ error: "something went wrong", details: error.message });
//     }
// })

// app.delete("/userDelete/:id", async (req, res) => {
//     const { id } = req.body;
//     try {
//         const deleteUser = await User.deleteOne({ id });
//         return res.status(200).json({ message: "user is deleted" });
//     }
//     catch (error) {
//         return res.status(500).json({ error: "error in deleting user", details: error.message });
//     }
// })


const userSignupSchema = Joi.object({

    name: Joi.string().required().pattern(/^[A-Za-z]+$/).messages({
        "any.required": "First name is required.",
        "string.empty": "First name cannot be empty.",
        "string.pattern.base": "First name must contain letters only.",
    }),
    mobileNumber: Joi.string()
        .length(10)
        .pattern(phoneRegex)
        .required()
        .messages({
            "any.required": "Phone number is required.",
            "string.empty": "Phone number cannot be empty.",
            "string.length": "Phone number must be exactly 10 digits long.",
            "string.pattern.base": "Phone number is invalid.",
        }),
    email: Joi.string().email().pattern(emailRegex).required().messages({
            "any.required": "Email is required.",
            "string.empty": "Email cannot be empty.",
            "string.email": "Invalid email format.",
        }),
    age: Joi.number().required().min(0).max(100).messages({
        "any.required": "Age is required.",
        "number.base": "Age must be a number.",
        "number.min": "Age cannot be less than 0.",
        "number.max": "Age cannot be greater than 100.",
    }),
    gender: Joi.string().valid("male","female","other").required(),
    password: Joi.string().pattern(passwordRegex),
});


app.post("/user", async (req, res) => {
    const { error, value } = userSignupSchema.validate(req.body, {abortEarly: false});
    if (error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const newUser = new User(value);
        const savedUser = await newUser.save();
        return res.status(200).json({ message: 'User added successful', savedUser });
    }
    catch (error) {
        if(error.code === 11000)
        {
            return res.status(200).json({ error: "user already exists" });
        }
        return res.status(400).json({message: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});