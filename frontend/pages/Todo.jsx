import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCheck, FaUndo, FaCheckCircle } from "react-icons/fa"; // Icons import

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todo/fetch");
      console.log("Fetched todos:", response.data.todos);
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error.response?.data || error.message);
    }
  };

  const addTodo = async () => {
    if (!text) return;
    try {
      const response = await api.post("/todo/create", {
        text,
        completed: false,
      });
      console.log("Added todo:", response.data.newTodo);
      setTodos([...todos, response.data.newTodo]);
      setText("");
    } catch (error) {
      console.error("Error adding todo:", error.response?.data || error.message);
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await api.put(`/todo/update/${id}`, {
        text: editingText,
      });
      console.log("Updated todo:", response.data.todo);
      setTodos(todos.map((todo) => (todo._id === id ? response.data.todo : todo)));
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todo/delete/${id}`);
      console.log("Deleted todo ID:", id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.response?.data || error.message);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await api.put(`/todo/update/${id}`, {
        completed: !currentStatus,
      });
      console.log("Toggled todo:", response.data.todo);
      setTodos(todos.map((todo) => (todo._id === id ? response.data.todo : todo)));
    } catch (error) {
      console.error("Error toggling complete status:", error.response?.data || error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
      console.log("Logged out successfully");
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-900 text-white">
      <div className="w-full max-w-lg flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 To-Do List</h1>
        <button
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="w-full max-w-lg flex gap-3">
        <input
          type="text"
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your todo.."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
      <ul className="mt-6 w-full max-w-lg space-y-4">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-md"
          >
            {editingId === todo._id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="bg-gray-700 p-2 border border-gray-600 rounded-lg w-full focus:outline-none"
              />
            ) : (
              <span
                className={`text-lg ${
                  todo.completed ? "line-through text-gray-400" : "text-white"
                }`}
              >
                {todo.text}
              </span>
            )}
            <div className="flex gap-2">
              {editingId === todo._id ? (
                <button
                  className="text-green-500 hover:text-green-600 transition"
                  onClick={() => updateTodo(todo._id)}
                >
                  <FaCheck size={20} />
                </button>
              ) : (
                <>
                  <button
                    className="text-yellow-500 hover:text-yellow-600 transition"
                    onClick={() => {
                      setEditingId(todo._id);
                      setEditingText(todo.text);
                    }}
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    className={`${
                      todo.completed
                        ? "text-gray-500 hover:text-gray-600"
                        : "text-green-500 hover:text-green-600"
                    } transition`}
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                  >
                    {todo.completed ? <FaUndo size={20} /> : <FaCheckCircle size={20} />}
                  </button>
                </>
              )}
              <button
                className="text-red-500 hover:text-red-600 transition"
                onClick={() => deleteTodo(todo._id)}
              >
                <FaTrash size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;