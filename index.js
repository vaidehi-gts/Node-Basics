const express = require("express");
const connectDB = require("./database");
const app = express();
app.use(express.json());
const User = require("./models/User")
const PORT = 3000;

const emailRegex = /^[^\s@]+@gmail\.com$/i;
const phoneRegex = /^[(]?(\d{3})[)]?[-|\s]?(\d{3})[-|\s]?(\d{4})$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;





const checkValidation = (name, email, mobileNumber,age, gender, password) => {
    if (!name) {
        throw new Error("name can not be empty");
    }
    if (/\d/.test(name)) {
        throw new Error("name do not contain number");
    }
    if (!email) {
        throw new Error("Email is required");
    }
    if ((!emailRegex.test(email))) {
        throw new Error("Email must be a Gmail address");
    }
    if (!mobileNumber) {
        throw new Error("mobile number is required");
    }
    if (!phoneRegex.test(mobileNumber)) {
        throw new Error("Please enter a valid mobile number eg : 884-761-3472");
    }
    if (!["other", "male", "female"].includes(gender)) {
        throw new Error("select a correct gender male,female,other");
    }
    if (!password) {
        throw new Error("Password is required");
    }
    if (!passwordRegex.test(password)) {
        throw new Error("password must have eight characters, at least one uppercase letter, one lowercase letter, one number and a special character");
    }
}
app.post("/user", async (req, res) => {
    console.log("post request");
    try {
        const { name, email, mobileNumber, age, gender, password, isActive } = req.body;
        console.log(name, email, mobileNumber, age, gender, password, isActive);
        try {
            checkValidation(name, email, mobileNumber, age, gender, password);
        }
        catch (validationError) {
            return res.status(400).json({ message: validationError.message });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }
        else {
            if (isActive) {
                const newUser = new User({ name, email, mobileNumber, age, gender, password, isActive });
                await newUser.save();
                return res.status(201).json({ message: "user added successfully" });
            }
            else {
                return res.status(500).json({ message: "person is not active" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: "error in adding user", details: error.message });
    }
})

app.get("/allUser", async (req, res) => {
    console.log("in the get");
    try {
        const getUsers = await User.find();
        console.log(getUsers);
        if (getUsers.length === 0) {
            return res.status(404).json({ message: "no user exists" });
        }
        return res.status(200).json(getUsers);
    }
    catch (error) {
        return res.status(500).json({ error: "error in getting" });
    }
})

app.put("/userUpdate/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body });
        if (!updatedUser) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ error: "something went wrong", details: error.message });
    }
})

app.delete("/userDelete/:id", async (req, res) => {
    const { id } = req.body;
    try {
        const deleteUser = await User.deleteOne({ id });
        return res.status(200).json({ message: "user is deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: "error in deleting user", details: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});