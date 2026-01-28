const Task = require("../models/Task");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.id,
    });

    await task.save();

    const io = req.app.get("io");
    io.emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id }, // 🔐 ownership check
      req.body,
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    const io = req.app.get("io");
    io.emit("taskUpdated", task);

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id, // 🔐 ownership check
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    const io = req.app.get("io");
    io.emit("taskDeleted", task._id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignTaskToMultiple = async (req, res) => {
  try {
    const { userIds } = req.body; // array of user IDs
    const taskId = req.params.id;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: "userIds must be a non-empty array"
      });
    }

    // ✅ check all users exist
    const users = await User.find({ _id: { $in: userIds } });

    if (users.length !== userIds.length) {
      return res.status(404).json({
        message: "One or more users not found"
      });
    }

    // ✅ only creator can assign
    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user.id },
      { $addToSet: { assignedTo: { $each: userIds } } }, // 🔥 no duplicates
      { new: true }
    );

    if (!task) {
      return res.status(403).json({
        message: "You are not authorized to assign this task"
      });
    }

    // 🔔 socket notification
    const io = req.app.get("io");
    io.emit("taskAssigned", {
      taskId: task._id,
      assignedTo: userIds
    });

    res.status(200).json({
      message: "Task assigned to multiple users successfully",
      task
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({
    $or: [
      { createdBy: req.user.id },
      { assignedTo: req.user.id }
    ]
  });

  res.json(tasks);
};
