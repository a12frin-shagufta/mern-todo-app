import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login.jsx";
import Todo from "../pages/Todo";

// ✅ Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // Check if token exists
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
