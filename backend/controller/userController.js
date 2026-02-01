const User= require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } }, // exclude self
      "_id name"
    );

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "_id name");

  res.json(task);
};

