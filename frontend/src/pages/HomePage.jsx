import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loggedInUserId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE TASK
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✏ UPDATE TASK (simple redirect or prompt-based)
  const updateTask = async (task) => {
    const title = prompt("Update title", task.title);
    const description = prompt("Update description", task.description);

    if (!title) return;

    try {
      const res = await api.put(`/tasks/${task._id}`, {
        title,
        description
      });

      setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <h3>Loading tasks...</h3>;

  return (
    <div>
      <button onClick={() => {
        localStorage.clear();
        navigate("/");
      }}>
        Logout
      </button>
      <button onClick={()=>{navigate("/createtask")}}>Create Task</button>
      <h2>Task Dashboard</h2>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map(task => (
          <div
            key={task._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px"
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description || "No description"}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    task.status === "completed"
                      ? "green"
                      : task.status === "in-progress"
                      ? "orange"
                      : "red"
                }}
              >
                {task.status}
              </span>
            </p>

            {/* 🔐 CREATOR-ONLY ACTIONS */}
            {task.createdBy === loggedInUserId && (
              <>
                <button
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/tasks/${task._id}/assign`)}
                >
                  Assign
                </button>

                <button onClick={() => updateTask(task)}>
                  Update
                </button>

                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
