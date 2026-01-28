const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTaskToMultiple, 
} = require("../controller/taskController");

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.put(
  "/:id/assign-multiple",
  auth,
  assignTaskToMultiple
);


module.exports = router;
