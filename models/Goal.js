const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: String,
    default: ""
  },

  deadline: {
    type: String,
    default: ""
  },

  progress: {
    type: Number,
    default: 0
  }

});

module.exports =
  mongoose.model(
    "Goal",
    goalSchema
  );