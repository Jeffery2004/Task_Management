const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id,
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
      { _id: req.params.id, userId: req.user.id }, // 🔐 ownership check
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
      userId: req.user.id, // 🔐 ownership check
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
