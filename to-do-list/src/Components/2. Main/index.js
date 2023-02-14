// Импортируем "useState" из Реакта
import React, { useState } from "react";
// Импортируем стили
import './style.css'
// Импорт картинок
import trash from './img/trash.png';
import moveBack from './img/moveback.png';

function TodoList() {

    // Hook для отображения модального окна добавления задач, по умолчанию - "false"
    const [addModalOpen, setModalOpen] = useState(false);

    // Hook для отображения модального окна списка задач, по умолчанию - "false"
    const [toDoModalOpen, setToDoModalOpen] = useState(false);

    const [selectedButtonCoordinates, setSelectedButtonCoordinates] = useState({ x: 0, y: 0 });

    // Hook для улавливания индекса задачи, на которую нажал пользователь, по умолчанию - null (значит никакой)
    const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);

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
    };
    
    // Функция переключателя модального окна добавления задач
    const toggleModal = () => {
        setModalOpen(!addModalOpen)
    }

    // Функция переключателя модального окна списка задач
    const toggleToDoModal = (event, index) => {
        setSelectedButtonCoordinates({
            x: event.target.offsetLeft,
            y: event.target.offsetTop,
          });
        // Передача индекса нажатой кнопки для задачи
        setSelectedTodoIndex(index);
        // Открытие или закрытие модального окна
        setToDoModalOpen(!toDoModalOpen);
    }

    return (
        <div className="mainWrapper">
            {/* Блок с кнопками */}
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
                    <button className="plusButton" onClick={toggleModal}></button>
                        {addModalOpen && (
                            <div className="modal">
                                <p>Add New To Do</p>
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    addTodo(e.target.todoInput.value);
                                    e.target.todoInput.value = "";
                                    toggleModal(); // Закрываем модальное окно после добавления задачи
                                }}>
                                    <textarea className="addInput" placeholder="Your text" type="text" name="todoInput" />
                                    <button className="modalAddButton" type="submit">Add</button>
                                </form>
                                <button className="modalCloseButton" onClick={toggleModal}></button>
                            </div>
                        )}
                </div>
            </div>
            {/* Блок с заголовком задач */}
            <h1 style={{fontSize: 24, marginTop: 64, marginBottom: 24}}>{(filter === "todo") ? "To Do" : (filter === "done") ? "Done" : (filter === "trash") ? "Trash" : "Я не знаю такой раздел!"}</h1>
            <hr style={{background: "#151517", opacity: 0.2, height: 2, marginBottom: 24}}></hr>
            {/* Блок с задачами */}
            <div>
                {filteredTodos.map((todo, index) => (
                    <div className="toDoList" key={index}>
                        <button className="toDoModalButton" onClick={(event) => toggleToDoModal(event, index)}></button>
                        {/* Проверка toDoModalOpen на состояние открытого модального окна и соответствия selectedTodoIndex индексу задачи, 
                        если оба значения true то выводим модальное окно*/}
                        {toDoModalOpen && selectedTodoIndex === index && (
                            <div className="toDoModal" style={{
                                position: 'absolute',
                                top: selectedButtonCoordinates.y,
                                left: selectedButtonCoordinates.x,
                              }}>
                                {!todo.completed && !todo.deleted && (
                                    <button className="toDoBtn" onClick={() => completeTodo(index)}><img src={moveBack} alt='img' />Complete</button>
                                )}
                                {!todo.deleted && (
                                    <button className="toDoBtn" onClick={() => deleteTodo(index)}><img src={trash} alt='img' />Move to Trash</button>
                                )}
                                {todo.deleted && (
                                    <>
                                        <button className="toDoBtn" onClick={() => permanentlyDeleteTodo(index)}><img src={trash} alt='img' />Delete Forever</button>
                                        <button className="toDoBtn" onClick={() => restoreTodo(index)}><img src={moveBack} alt='img' />Move Back To To Do</button>
                                    </>
                                )}
                            </div>
                        )}
                        <p className="toDoTask" style={{textDecoration: todo.completed ? "line-through" : "none"}}>{todo.task}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
    
export default TodoList;