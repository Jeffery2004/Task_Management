const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTaskToMultiple
} = require("../controller/taskController");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.get("/:id", auth, getTaskById);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.put("/:id/assign-multiple", auth, assignTaskToMultiple);

module.exports = router;
