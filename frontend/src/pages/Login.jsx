import React from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const nav = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    // Handle login logic here
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      nav("/home");
    } catch (error) {
      alert("Login failed! Please check your credentials.");
    }
  }
  return (
    <>
      <div className="header">
        <h1>Login</h1>
      </div>
      <div className="form-body">
        <form onSubmit={handleSubmit}>
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
