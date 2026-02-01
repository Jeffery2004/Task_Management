import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTask.css";

const CreateTask = () => {
  const nav = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", taskData);
      alert("Task created successfully!");
      nav("/home");
    } catch (error) {
      alert("Failed to create task.");
    }
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <h2>Create Task</h2>

        <form onSubmit={createTask}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter task description"
              rows="4"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
            />
          </div>

          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
