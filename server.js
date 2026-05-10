const PORT = process.env.PORT || 5000;

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const dotenv = require("dotenv");

const Goal = require("./models/Goal");

dotenv.config();

const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

})

.catch((err) => {

  console.log(err);

});


// HOME ROUTE

app.get("/", (req, res) => {

  res.send("Server Running");

});


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

      progress: req.body.progress

    });

    await newGoal.save();

    res.json(newGoal);

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

    await Goal.findByIdAndDelete(req.params.id);

    res.json({

      message: "Goal Deleted Successfully"

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});


// UPDATE GOAL PROGRESS

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


// SERVER PORT

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});