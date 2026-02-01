import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const AssignTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 🔹 Fetch task
      const taskRes = await api.get(`/tasks/${id}`);
      setAssignedUserIds(
        taskRes.data.assignedTo.map(u => u._id)
      );

      // 🔹 Fetch users
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
    } catch (err) {
      alert("Assignment failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  // 🔥 FILTER USERS (remove already assigned)
  const assignableUsers = users.filter(
    user => !assignedUserIds.includes(user._id)
  );

  return (
    <div style={{ maxWidth: "400px", margin: "30px auto" }}>
      <h2>Assign Task</h2>

      {assignableUsers.length === 0 ? (
        <p>All users are already assigned.</p>
      ) : (
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          {assignableUsers.map(user => (
            <label
              key={user._id}
              style={{ display: "block", marginBottom: "8px" }}
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />{" "}
              {user.name}
            </label>
          ))}
        </div>
      )}

      <br />

      <button onClick={assignTask} disabled={assignableUsers.length === 0}>
        Assign
      </button>
      <button onClick={() => navigate("/home")} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </div>
  );
};

export default AssignTask;
