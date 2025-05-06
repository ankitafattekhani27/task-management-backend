const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // creator
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assigned user
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
