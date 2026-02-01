import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import socket from "../socket";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loggedInUserId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
      );
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    socket.on("taskAssigned", () => {
      fetchTasks(); // safest approach
    });

    return () => {
      socket.disconnect();
    };
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

      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  // 🗑 DELETE TASK
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
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
        description,
      });

      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <h3>Loading tasks...</h3>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Task Dashboard</h2>

        <div className="header-actions">
          <button onClick={() => navigate("/createtask")}>+ Create Task</button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-text" style={{ color: "black" }}>No tasks available</p>
      ) : (
        tasks.map((task) => {
          const isCreator = task.createdBy === loggedInUserId;

          return (
            <div className="task-card" key={task._id}>
              <div className="task-header">
                <span
                  className={isCreator ? "badge creator" : "badge assigned"}
                >
                  {isCreator ? "Created by you" : "Assigned to you"}
                </span>

                <span className={`status ${task.status}`}>{task.status}</span>
              </div>

              <h3>{task.title}</h3>
              <p className="description">
                {task.description || "No description"}
              </p>

              {isCreator && (
                <select
                  className="status-select"
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}

              <div className="task-actions">
                <button onClick={() => navigate(`/tasks/${task._id}/view`)}>
                  View
                </button>

                {isCreator && (
                  <>
                    <button
                      onClick={() => navigate(`/tasks/${task._id}/assign`)}
                    >
                      Assign
                    </button>
                    <button onClick={() => updateTask(task)}>Update</button>
                    <button
                      className="danger"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HomePage;
