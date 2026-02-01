const Task = require("../models/Task");
const User = require("../models/User");

/**
 * ✅ CREATE TASK
 * Creator becomes owner automatically
 */
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

/**
 * ✅ GET ALL TASKS FOR LOGGED-IN USER
 * - Tasks created by user
 * - Tasks assigned to user
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ GET SINGLE TASK (for View / Assign page)
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "_id name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 Allow only creator or assigned user
    if (
      task.createdBy.toString() !== req.user.id &&
      !task.assignedTo.some(u => u._id.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ UPDATE TASK (ONLY CREATOR)
 */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
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

/**
 * ✅ DELETE TASK (ONLY CREATOR)
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
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

/**
 * ✅ ASSIGN TASK TO MULTIPLE USERS (ONLY CREATOR)
 * - Prevents duplicates
 * - Independent per task
 */
exports.assignTaskToMultiple = async (req, res) => {
  try {
    const { userIds } = req.body;
    const taskId = req.params.id;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: "userIds must be a non-empty array"
      });
    }

    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({
        message: "One or more users not found"
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user.id },
      { $addToSet: { assignedTo: { $each: userIds } } },
      { new: true }
    );

    if (!task) {
      return res.status(403).json({
        message: "You are not authorized to assign this task"
      });
    }

    const io = req.app.get("io");
    io.emit("taskAssigned", {
      taskId: task._id,
      assignedTo: userIds
    });

    res.status(200).json({
      message: "Task assigned successfully",
      task
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
