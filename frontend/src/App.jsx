import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Signup from "../pages/Signup";
import Login from "../pages/Login.jsx";
import Todo from "../pages/Todo";

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

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      let retries = 3;
      let delay = 2000;

      while (retries > 0) {
        try {
          const response = await api.get("/user/verify");
          setIsAuthenticated(true);
          return;
        } catch (error) {
          if (error.response) {
            setIsAuthenticated(false);
            return;
          } else if (error.request) {
            retries--;
            if (retries === 0) {
              setIsAuthenticated(false);
            } else {
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
    );
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