import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSignOutAlt, FaCheck } from "react-icons/fa";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Popup state
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todo/fetch");
      console.log("Fetched todos:", response.data);
      setTodos(Array.isArray(response.data.todos) ? response.data.todos : []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error.response) {
        setError(error.response.data.message || "Failed to fetch todos");
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An error occurred: " + error.message);
      }
      setTodos([]);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await api.post("/todo/create", { text: newTodo });
      console.log("Created todo:", response.data);
      if (response.data.newTodo && response.data.newTodo._id) {
        setTodos([...todos, response.data.newTodo]);
      } else {
        console.error("Invalid todo response:", response.data);
        setError("Failed to create todo: Invalid response");
      }
      setNewTodo("");
    } catch (error) {
      setError(error.response?.data.message || "Failed to create todo");
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo._id);
    setEditTitle(todo.text);
  };

  const handleUpdateTodo = async (id) => {
    try {
      const response = await api.put(`/todo/update/${id}`, { text: editTitle });
      setTodos(todos.map((todo) => (todo._id === id ? response.data.todo : todo)));
      setEditingTodo(null);
      setEditTitle("");
    } catch (error) {
      setError(error.response?.data.message || "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/todo/delete/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      setError(error.response?.data.message || "Failed to delete todo");
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const response = await api.put(`/todo/mark/${id}`);
      setTodos(todos.map((todo) => (todo._id === id ? response.data.todo : todo)));
    } catch (error) {
      console.error("Error marking todo as completed:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        setError(error.response.data.message || "Failed to mark todo as completed");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        setError("An error occurred: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data.message || "Failed to logout");
    }
  };

  const confirmLogout = () => {
    setShowLogoutPopup(true); // Popup dikhao
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false); // Popup band karo
    handleLogout(); // Logout karo
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false); // Popup band karo
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <button onClick={confirmLogout} className="text-red-500 hover:text-red-400">
            <FaSignOutAlt size={24} />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Create Todo Form */}
        <form onSubmit={handleCreateTodo} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
          <button type="submit" className="text-blue-500 hover:text-blue-400">
            <FaPlus size={24} />
          </button>
        </form>

        {/* Todo List */}
        {todos.length === 0 ? (
          <p>No todos available.</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2"
              >
                {editingTodo === todo._id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                    />
                    <button
                      onClick={() => handleUpdateTodo(todo._id)}
                      className="text-green-500 hover:text-green-400"
                    >
                      <FaSave size={20} />
                    </button>
                    <button
                      onClick={() => setEditingTodo(null)}
                      className="text-gray-500 hover:text-gray-400"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkAsCompleted(todo._id)}
                        className={`${
                          todo.completed
                            ? "text-green-500 hover:text-green-400"
                            : "text-gray-500 hover:text-gray-400"
                        }`}
                      >
                        <FaCheck size={20} />
                      </button>
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to logout?</h2>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;