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

  // 🔁 UPDATE STATUS
  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status });

      setTasks(tasks.map(t =>
        t._id === taskId ? res.data : t
      ));
    } catch (err) {
      console.error("Status update failed", err);
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

  // ✏ UPDATE TASK
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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>

      <button onClick={() => navigate("/createtask")}>
        Create Task
      </button>

      <h2>Task Dashboard</h2>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map(task => {
          const isCreator = task.createdBy === loggedInUserId;

          return (
            <div
              key={task._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "12px"
              }}
            >
              {/* 🔹 LABEL */}
              <p style={{ fontWeight: "bold" }}>
                {isCreator ? (
                  <span style={{ color: "green" }}>
                    Created by you
                  </span>
                ) : (
                  <span style={{ color: "blue" }}>
                    Assigned to you
                  </span>
                )}
              </p>

              <h3>{task.title}</h3>
              <p>{task.description || "No description"}</p>

              {/* STATUS DISPLAY */}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      task.status === "completed"
                        ? "green"
                        : task.status === "in-progress"
                        ? "orange"
                        : "red",
                    fontWeight: "bold",
                    marginRight: "10px"
                  }}
                >
                  {task.status}
                </span>
              </p>

              {/* 🔁 CHANGE STATUS (CREATOR ONLY) */}
              {isCreator && (
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatus(task._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}

              <br /><br />

              {/* 🔐 ACTIONS */}
              <button
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                View
              </button>

              {isCreator && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/tasks/${task._id}/assign`)
                    }
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
          );
        })
      )}
    </div>
  );
};

export default HomePage;
