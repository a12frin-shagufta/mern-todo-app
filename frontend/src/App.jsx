import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Signup from "../pages/Signup";
import Login from "../pages/Login.jsx";
import Todo from "../pages/Todo";

// Determine API URL based on environment
const getApiUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  return "https://mern-todo-app-kxne.onrender.com";
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

// ✅ Protected Route Component
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      let retries = 3; // Number of retries
      let delay = 2000; // 2 seconds delay between retries

      while (retries > 0) {
        try {
          const response = await api.get("/user/verify");
          console.log("Auth check response:", response.data);
          setIsAuthenticated(true);
          return; // Exit on success
        } catch (error) {
          console.error("Auth check failed:", error);
          if (error.response) {
            // If backend responds with an error (e.g., 401), stop retrying
            setIsAuthenticated(false);
            return;
          } else if (error.request) {
            // No response received (server might be waking up)
            retries--;
            if (retries === 0) {
              setIsAuthenticated(false);
            } else {
              console.log(`Retrying auth check... (${retries} attempts left)`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          } else {
            setIsAuthenticated(false);
            return;
          }
        }
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    ); // Improved loading UI
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center p-5 bg-gray-900 text-white">
        <main className="p-4">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todo" element={<ProtectedRoute element={<Todo />} />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;