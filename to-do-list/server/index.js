import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 8080;
const atlasUrl = "mongodb+srv://shao55:RpdfQSz5FdBXjNtb@nurcluster.vhqrmfk.mongodb.net/todoDB";

mongoose
    .connect(atlasUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas!"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
    deleted: Boolean
})

const Todo = mongoose.model("Todo", todoSchema);

app.use(cors({ origin: "*" }), express.json());

app.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send({ message: "Ошибка при получении задач", error });
    }
    // res.status(200).send(todos);
});

app.post("/", async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        const savedTodo = await newTodo.save();
        res.status(200).send(savedTodo);
    } catch (error) {
        res.status(500).send("Error adding new todo:", error);
    }
});

app.put("/:id", async (req, res) => {
    try {
        const todoId = req.params.id;
        const updatedTodo = req.body;
        const result = await Todo.findByIdAndUpdate(todoId, updatedTodo, { new: true });
        res.json(result);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).send({ message: "Error updating todo:", error: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT} port!`)
})