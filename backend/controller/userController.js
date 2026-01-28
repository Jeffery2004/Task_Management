const User= require("../models/User");

exports.getAllUsers=async (req, res) => {
    try {
        const users = await User.find().select("_id name");
        res.status(200).json(users);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }   
};