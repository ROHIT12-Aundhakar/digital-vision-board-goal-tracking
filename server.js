const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Goal = require("./models/Goal");
const User = require("./models/User");

// CONFIG

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI, {

  useNewUrlParser: true,
  useUnifiedTopology: true

})

.then(() => {

  console.log("MongoDB Connected");

})

.catch((error) => {

  console.log(error);

});

// HOME ROUTE

app.get("/", (req, res) => {

  res.send("Server running");

});

// ==========================
// GOALS ROUTES
// ==========================

// GET ALL GOALS

app.get("/goals", async (req, res) => {

  try {

    const goals = await Goal.find();

    res.json(goals);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// ADD GOAL

app.post("/goals", async (req, res) => {

  try {

    const newGoal = new Goal({

      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      deadline: req.body.deadline,
      progress: req.body.progress

    });

    const savedGoal =
      await newGoal.save();

    res.json(savedGoal);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// UPDATE GOAL

app.put("/goals/:id", async (req, res) => {

  try {

    const updatedGoal =
      await Goal.findByIdAndUpdate(

        req.params.id,
        req.body,
        { new: true }

      );

    res.json(updatedGoal);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// DELETE GOAL

app.delete("/goals/:id", async (req, res) => {

  try {

    await Goal.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Goal Deleted"
    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// ==========================
// AUTH ROUTES
// ==========================

// SIGNUP

app.post("/signup", async (req, res) => {

  try {

    const {
      username,
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.json({
        message: "User already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({

      username,
      email,
      password: hashedPassword

    });

    await newUser.save();

    res.json({
      message: "Signup Successful"
    });

  }

  catch (error) {

    res.status(500).json({
      message: "Signup Failed"
    });

  }

});

// LOGIN

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.json({
        message: "User not found"
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.json({
        message: "Invalid password"
      });

    }

    const token = jwt.sign(

      { id: user._id },

      "mysecretkey"

    );

    res.json({

      token,
      username: user.username

    });

  }

  catch (error) {

    res.status(500).json({
      message: "Login Failed"
    });

  }

});

// START SERVER

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});