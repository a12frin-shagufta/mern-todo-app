import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Determine API URL based on environment
const getApiUrl = () => {
  // If running on localhost (development), use local backend
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  // Otherwise, use deployed backend (production)
  return "https://mern-todo-app-kxne.onrender.com";
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("API URL being used:", getApiUrl());
      console.log("Login request body:", formData);
      const response = await api.post("/user/login", formData);
      console.log("Login successful:", response.data);
      navigate("/todo");
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        setError(error.response.data.message || "Login failed. Please try again.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        setError("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
          Login
        </button>
        <p className="mt-4 text-gray-400">
          Don't have an account?  
          <Link to="/signup" className="text-blue-500 hover:underline ml-2">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;