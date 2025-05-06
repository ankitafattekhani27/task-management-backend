const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const Task = require("../models/Task");  

// Create a new task
 // POST /api/tasks
router.post("/", authenticateUser, async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  try {
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user.userId,
      assignedTo: assignedTo || null,
    });

    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(400).json({ message: "Error creating task", error: err.message });
  }
});


 // Get all tasks with search and filter
router.get("/", authenticateUser, async (req, res) => {
  const { status, priority, dueDate, query } = req.query;
  const userId = req.user.userId;

  let filter = {
    user: userId, // Show only tasks created by this user
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  try {
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to filter tasks", error: err.message });
  }
});


// GET /api/tasks/assigned-to-me
router.get("/assigned-to-me", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate("user", "name email")  // Creator details
      .populate("assignedTo", "name email");  // Assignee details

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks assigned to you." });
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

router.get("/assigned-to-me", authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate("user", "name email") // Task creator
      .populate("assignedTo", "name email"); // Task assignee

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks assigned to you." });
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// Dashboard route
router.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    // Tasks created by the user
    const createdTasks = await Task.find({ user: userId });

    // Tasks assigned to the user
    const assignedTasks = await Task.find({ assignedTo: userId });

    // Overdue tasks (assigned to user and past due date, and not completed)
    const overdueTasks = await Task.find({
      assignedTo: userId,
      dueDate: { $lt: now },
      status: { $ne: "completed" },
    });

    res.status(200).json({
      createdTasks,
      assignedTasks,
      overdueTasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard", error: err.message });
  }
});




// Update a task
router.put("/:id", authenticateUser, async (req, res) => {
  const { title, description } = req.body;

  try {
    // Find task by ID and make sure the user is the one who created the task
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    // Update task fields
    task.title = title || task.title;  // If new title is provided, update it, otherwise keep old one
    task.description = description || task.description;  // Same for description

    await task.save();
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(400).json({ message: "Error updating task", error: err.message });
  }
});

// Delete a task
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    // Find task by ID and ensure it's the logged-in user's task
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});

module.exports = router;
