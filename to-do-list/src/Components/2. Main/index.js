import React, { useState } from "react";

function TodoList() {
    const [modalOpen, setModalOpen] = useState(false);

    const [filter, setFilter] = useState("all");

    const [todos, setTodos] = useState([
        { task: "Выучить хуки", completed: false, deleted: false },
        { task: "Выучить setState", completed: false, deleted: false },
        { task: "Сделать домашку до лекции", completed: false, deleted: false },
        { task: "Сделать еженедельный проект", completed: false, deleted: false },
        { task: "Отдыхать на выходных", completed: false, deleted: false },
    ]);

    const addTodo = task => {
        setTodos([...todos, { task, completed: false, deleted: false }]);
    };

    const completeTodo = index => {
        const newTodos = [...todos];
        newTodos[index].completed = true;
        setTodos(newTodos);
    };

    const deleteTodo = index => {
        const newTodos = [...todos];
        newTodos[index].deleted = true;
        setTodos(newTodos);
    };

    const restoreTodo = index => {
        const newTodos = [...todos];
        newTodos[index].deleted = false;
        setTodos(newTodos);
    };

    const permanentlyDeleteTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "active") return !todo.completed && !todo.deleted;
        if (filter === "completed") return todo.completed && !todo.deleted;
        if (filter === "deleted") return todo.deleted;
        return true;
    });
  
    return (
        <div>
            <h1>ToDo List</h1>
            <div>
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("active")}>Active</button>
                <button onClick={() => setFilter("completed")}>Completed</button>
                <button onClick={() => setFilter("deleted")}>Deleted</button>
                <div>
                    <button onClick={() => setModalOpen(true)}>Add Todo</button>
                        {modalOpen && (
                            <div>
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    addTodo(e.target.todoInput.value);
                                    e.target.todoInput.value = "";
                                    setModalOpen(false); // Закрываем модальное окно после добавления задачи
                                }}>
                                    <input type="text" name="todoInput" />
                                    <button type="submit">Add Todo</button>
                                </form>
                                <button onClick={() => setModalOpen(false)}>Close</button>
                            </div>
                        )}
                </div>
            </div>
            <div>
                {filteredTodos.map((todo, index) => (
                    <div key={index}>
                        <p style={{textDecoration: todo.completed ? "line-through" : "none"}}>{todo.task}</p>
                        {!todo.completed && !todo.deleted && (
                            <button onClick={() => completeTodo(index)}>Complete</button>
                        )}
                        {!todo.deleted && (
                            <button onClick={() => deleteTodo(index)}>Delete</button>
                        )}
                        {todo.deleted && (
                            <>
                                <button onClick={() => restoreTodo(index)}>Restore</button>
                                <button onClick={() => permanentlyDeleteTodo(index)}>
                                Permanently Delete
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
    
export default TodoList;