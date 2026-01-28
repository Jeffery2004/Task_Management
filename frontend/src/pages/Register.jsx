import React,{useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    // Handle registration logic here
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name: formData.username,
          email: formData.email,
          password: formData.password,
        },
      );
      if(response.data.message==="User registered successfully"){
        console.log("User registered successfully");
        alert("User registered successfully");
        nav("/");
        return;
      }else{
        alert("Registration failed");
        return;
      }
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
                setFormData({ ...formData, username: e.target.value })
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
