import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const darkMode = localStorage.getItem("darkMode") === "true";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Test GET request
      const testResponse = await api.get("/test");
      console.log("Test Response:", testResponse.data);

      // Login POST request
      const response = await api.post("/user/login", { email, password });
      console.log("Login Response:", response.data);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/todo");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className={`p-8 rounded-lg shadow-md w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white rounded-lg transition bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Login
          </button>
        </form>
        <p className="p-2 text-center">Don't have an account?</p>
        <Link
          to="/signup"
          className="block w-full py-2 text-center rounded-lg transition bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;