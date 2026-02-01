import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AssignTask.css";

const AssignTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const taskRes = await api.get(`/tasks/${id}`);
      setAssignedUserIds(taskRes.data.assignedTo.map(u => u._id));

      const usersRes = await api.get("/users");
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error loading assign data", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const assignTask = async () => {
    if (selectedUsers.length === 0) {
      alert("Select at least one user");
      return;
    }

    try {
      await api.put(`/tasks/${id}/assign-multiple`, {
        userIds: selectedUsers
      });
      alert("Task assigned successfully");
      navigate("/home");
    } catch {
      alert("Assignment failed");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  const assignableUsers = users.filter(
    user => !assignedUserIds.includes(user._id)
  );

  return (
    <div className="assign-page">
      <div className="assign-card">
        <h2>Assign Task</h2>

        {assignableUsers.length === 0 ? (
          <p className="empty-text">All users are already assigned.</p>
        ) : (
          <div className="user-list">
            {assignableUsers.map(user => (
              <label key={user._id} className="user-item">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                />
                <span>{user.name}</span>
              </label>
            ))}
          </div>
        )}

        <div className="assign-actions">
          <button
            onClick={assignTask}
            disabled={assignableUsers.length === 0}
          >
            Assign
          </button>
          <button
            className="secondary"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
