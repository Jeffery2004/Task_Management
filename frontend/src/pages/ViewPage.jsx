import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ViewPage.css";

const ViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (error) {
        alert("Failed to fetch task details");
        navigate("/home");
      }
    };
    fetchTask();
  }, [id, navigate]);

  if (!task) return <p className="loading-text">Loading task...</p>;

  return (
    <div className="view-page">
      <div className="view-card">
        <h2>Task Details</h2>

        <div className="task-field">
          <span className="label">Title:</span>
          <p>{task.title}</p>
        </div>

        <div className="task-field">
          <span className="label">Description:</span>
          <p>{task.description || "No description"}</p>
        </div>

        <div className="task-field">
          <span className="label">Status:</span>
          <span className={`status-badge ${task.status}`}>
            {task.status}
          </span>
        </div>

        <div className="task-field">
          <span className="label">Assigned Users:</span>

          {task.assignedTo && task.assignedTo.length > 0 ? (
            <ul className="user-list">
              {task.assignedTo.map(user => (
                <li key={user._id}>{user.name}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">No users assigned</p>
          )}
        </div>

        <button onClick={() => navigate("/home")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewPage;
