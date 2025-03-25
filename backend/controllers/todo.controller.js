import Todo from "../model/todo.model.js";

export const createTodo = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User ID from verifyToken:", req.userId);

    const { text, completed } = req.body;
    const userId = req.userId;

    if (!text) {
      console.log("Validation failed: Text is missing");
      return res.status(400).json({ message: "Text is required" });
    }
    if (!userId) {
      console.log("Validation failed: User ID is missing");
      return res.status(401).json({ message: "User ID missing, unauthorized" });
    }

    const todo = new Todo({
      text,
      completed: completed !== undefined ? completed : false,
      userId, // 'userId' matches schema
    });

    console.log("New Todo before save:", todo);
    const newTodo = await todo.save();
    console.log("New Todo after save:", newTodo);

    res.status(201).json({ message: "Todo created successfully", newTodo });
  } catch (error) {
    console.error("Error creating todo:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Error creating todo",
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};



export const getTodo = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    console.log("Todos fetched for user:", req.userId, todos); // Debug log
    res.status(200).json(todos || []); // Ensure array response
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    console.log("Updating todo ID:", req.params.id, "for user:", req.userId);
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // 'userId' matches schema
      req.body,
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(400).json({ message: "Error updating todo", error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    console.log("Deleting todo ID:", req.params.id, "for user:", req.userId);
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId }); // 'userId' matches schema
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(400).json({ message: "Error deleting todo", error: error.message });
  }
};

export const markTodoAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Marking todo as completed - ID:", id, "User ID:", req.userId);
    const todo = await Todo.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      console.log("Todo not found for ID:", id);
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    console.log("Updated todo:", todo);
    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error marking todo as completed:", error);
    res.status(500).json({ message: "Failed to mark todo as completed" });
  }
};