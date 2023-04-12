import express from "express";
import cors from "cors";
const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }), express.json());

let todos = [{ id: 1, task: "Write Essay", completed: false, deleted: false },
{ id: 2, task: "One Hour CSS Course Online", completed: false, deleted: false },
{ id: 3, task: "Buy One Way Tickets to San Fransico", completed: false, deleted: false },
{ id: 4, task: "Go to Gym", completed: false, deleted: false },
{ id: 5, task: "Buy Groceries", completed: true, deleted: false },
]

app.get("/", (req, res) => {
    res.status(200).send(todos);
})

app.post("/", (req, res) => {
    const newToDo = req.body;
    newToDo.id = todos.length + 1;
    todos.push(newToDo)
    res.status(200).send(newToDo);
})

app.put("/:id", (req, res) => {
    const todoId = parseInt(req.params.id);
    const updatedTodo = req.body;
    todos = todos.map(todo => todo.id === todoId ? updatedTodo : todo);
    res.json(updatedTodo);
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT} port!`)
})