// Импортируем "useState" из Реакта
import React, { useState } from "react";
// Импортируем стили
import './style.css'

function TodoList() {

    // Hook для отображения модального окна, по умолчанию - "false"
    const [addModalOpen, setModalOpen] = useState(false);

    // Hook для отслеживания нажатия кнопки
    const [activeFilter, setActiveFilter] = useState("todo");   

    // Hook для фильтрации отображения задач на главной странице, по умолчанию - "all"
    const [filter, setFilter] = useState("todo");

    // Hook для работы с задачами, удалять, добавлять, перемещать в корзину, по умолчанию - список из массива объектов
    const [todos, setTodos] = useState([
        { task: "Write Essay", completed: false, deleted: false },
        { task: "One Hour CSS Course Online", completed: false, deleted: false },
        { task: "Buy One Way Tickets to San Fransico", completed: false, deleted: false },
        { task: "Go to Gym", completed: false, deleted: false },
        { task: "Buy Groceries", completed: true, deleted: false },
    ]);

    // Добавление задачи
    const addTodo = task => {
        setTodos([...todos, { task, completed: false, deleted: false }]);
    };

    // Завершение задачи
    const completeTodo = index => {
        const newTodos = [...todos];
        newTodos[index].completed = true;
        setTodos(newTodos);
    };

    // Удаление задачи
    const deleteTodo = index => {
        const newTodos = [...todos];
        newTodos[index].deleted = true;
        setTodos(newTodos);
    };

    // Восстановление задачи
    const restoreTodo = index => {
        const newTodos = [...todos];
        newTodos[index].deleted = false;
        setTodos(newTodos);
    };

    // Перемещение задачи в корзину
    const permanentlyDeleteTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    // Фильтрация задачи для отображения на кнопках
    const filteredTodos = todos.filter(todo => {
        if (filter === "todo") return !todo.deleted
        if (filter === "done") return todo.completed && !todo.deleted;
        if (filter === "trash") return todo.deleted;
        return true;
    });

    const handleFilter = filter => {
        setFilter(filter);
        setActiveFilter(filter);
    };
    
  
    return (
        <div className="mainWrapper">
            <div className="buttons">
                <div className="filterbuttons">
                    <button
                        className={filter === "todo" ? "active" : "notActive"}
                        onClick={() => handleFilter("todo")}>To Do
                    </button>

                    <button 
                        className={filter === "done" ? "active" : "notActive"}
                        onClick={() => handleFilter("done")}>Done
                    </button>

                    <button 
                        className={filter === "trash" ? "active" : "notActive"}
                        onClick={() => handleFilter("trash")}>Trash
                    </button>
                </div>
                <div className="addbutton">
                    <button className="plusButton" onClick={() => setModalOpen(true)}></button>
                        {addModalOpen && (
                            <div className="modal">
                                <p>Add New To Do</p>
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    addTodo(e.target.todoInput.value);
                                    e.target.todoInput.value = "";
                                    setModalOpen(false); // Закрываем модальное окно после добавления задачи
                                }}>
                                    <textarea className="addInput" placeholder="Your text" type="text" name="todoInput" />
                                    <button className="modalAddButton" type="submit">Add</button>
                                </form>
                                <button className="modalCloseButton" onClick={() => setModalOpen(false)}></button>
                            </div>
                        )}
                </div>
            </div>
            <h1 style={{fontSize: 24, marginTop: 64, marginBottom: 24}}>{(filter === "todo") ? "To Do" : (filter === "done") ? "Done" : (filter === "trash") ? "Trash" : "Я не знаю такой раздел!"}</h1>
            <hr style={{background: "#151517", opacity: 0.2, height: 2, marginBottom: 24}}></hr>
            <div>
                {filteredTodos.map((todo, index) => (
                    <div key={index}>
                        <p style={{textDecoration: todo.completed ? "line-through" : "none"}}>{todo.task}</p>
                        {!todo.completed && !todo.deleted && (
                            <button onClick={() => completeTodo(index)}>Complete</button>
                        )}
                        {!todo.deleted && (
                            <button onClick={() => deleteTodo(index)}>Move to Trash</button>
                        )}
                        {todo.deleted && (
                            <div>
                                <button onClick={() => restoreTodo(index)}>Move Back To To Do</button>
                                <button onClick={() => permanentlyDeleteTodo(index)}>Delete Forever</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
    
export default TodoList;