import React,{useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    // Handle registration logic here
    try {
      console.log(formData);
      const response = await api.post("/auth/register", formData);
      alert(response.data.message);
      nav("/");
    } catch (error) {
      console.error("There was an error registering the user!", error);
    }
  }
  return (
    <>
      <div className="form-header">
        <h1>Register</h1>
      </div>
      <div className="form-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              required
            />
          </div>
          <button type="submit">
            Register
          </button>
          <p>
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
