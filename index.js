const express = require("express");
const connectDB = require("./database");
const app = express();
app.use(express.json());
const User = require("./models/User")
const PORT = 3000;

app.post("/user", async (req, res) => {
    console.log("post request");
    try {
        const { name, email, mobileNumber, age, gender, password, isActive } = req.body;
        console.log(name, email, mobileNumber, age, gender, password, isActive);
        if (!name || /\d/.test(name)) {
            return res.status(404).json({ message: "name can not be empty and do not contain number" })
        }
        const emailRegex = /^[^\s@]+@gmail\.com$/i; 
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email must be a Gmail address" });
        }
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        if (!phoneRegex.test(mobileNumber)) {
            return res.status(404).json({ message: "Not a valid mobile number" });
        }
        if (!["other", "male", "female"].includes(gender)) {
            return res.status(404).json({ message: "select a correct gender" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password))
        {
            return res.status(404).json({message:"password must have eight characters, at least one uppercase letter, one lowercase letter, one number and a special character"});
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }
        else {
            if (isActive) {
                const newUser = new User({ name, email, mobileNumber, age, gender, password, isActive });
                console.log(newUser);
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