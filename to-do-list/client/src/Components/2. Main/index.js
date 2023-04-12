// Импортируем "useState" из Реакта
import React, { useEffect, useState } from "react";
import axios from "axios";
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

    // Hook для отслеживания координат кликом
    const [selectedButtonCoordinates, setSelectedButtonCoordinates] = useState({ x: 0, y: 0 });

    // Hook для улавливания индекса задачи, на которую нажал пользователь, по умолчанию - null (значит никакой)
    const [selectedTodoid, setSelectedTodoid] = useState(null);

    // Hook для фильтрации отображения задач на главной странице, по умолчанию - "all"
    const [filter, setFilter] = useState("todo");

    // Hook для работы с задачами, удалять, добавлять, перемещать в корзину, по умолчанию - список из массива объектов
    const [todos, setTodos] = useState([]);

    // Добавление задачи
    const addTodo = async (task) => {
        try {
            const response = await axios.post("http://localhost:8080/", { task, completed: false, deleted: false });
            setTodos([...todos, response.data]);
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
        }
    };

    // Завершение задачи
    const completeTodo = (id) => {
        const updatedTodo = todos.find(todo => todo.id === id);
        updatedTodo.completed = true;
        updateTodo(id, updatedTodo);
    };

    // Отмена завершения задачи
    const uncompleteTodo = (id) => {
        const updatedTodo = todos.find(todo => todo.id === id);
        updatedTodo.completed = false;
        updateTodo(id, updatedTodo);
    };

    // Удаление задачи
    const deleteTodo = (id) => {
        const updatedTodo = todos.find(todo => todo.id === id);
        updatedTodo.deleted = true;
        updateTodo(id, updatedTodo);
    };

    // Восстановление задачи
    const restoreTodo = (id) => {
        const updatedTodo = todos.find(todo => todo.id === id);
        updatedTodo.deleted = false;
        updateTodo(id, updatedTodo);
    };

    // Перемещение задачи в корзину
    const permanentlyDeleteTodo = (id) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
    };


    const updateTodo = async (id, updatedTodo) => {
        try {
            const response = await axios.put(`http://localhost:8080/${updatedTodo.id}`, updatedTodo);
            if (response.status === 200) {
                const newTodos = [...todos];
                const index = newTodos.findIndex(todo => todo.id === id);
                if (index !== -1) {
                    newTodos[index] = updatedTodo;
                    setTodos(newTodos);
                } else {
                    console.error("Ошибка: задача с указанным ID не найдена.");
                }
            } else {
                console.error("Ошибка при обновлении задачи:", response);
            }
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
        }
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
    const toggleToDoModal = (event, id) => {
        setSelectedButtonCoordinates({
            x: event.target.offsetLeft,
            y: event.target.offsetTop,
        });
        // Передача индекса нажатой кнопки для задачи
        setSelectedTodoid(id);
        // Открытие или закрытие модального окна
        setToDoModalOpen(!toDoModalOpen);
    }

    const fetchToDos = async () => {
        try {
            const response = await axios.get("http://localhost:8080/");
            setTodos(response.data);
        } catch (error) {
            console.log("Ошибка загрузки ToDos", error);
        }
    }

    useEffect(() => {
        fetchToDos();
    }, []);

    useEffect(() => {
        console.log("todos изменился!")
    }, [todos]);

    const filterTitles = {
        todo: "To Do",
        done: "Done",
        trash: "Trash",
    };

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
                        </div>
                    )}
                </div>
            </div>
            {/* Блок с заголовком задач */}
            <h1 style={{ fontSize: 24, marginTop: 64, marginBottom: 24 }}>{filterTitles[filter]}</h1>
            <hr style={{ background: "#151517", opacity: 0.2, height: 2, marginBottom: 24 }}></hr>
            {/* Блок с задачами */}
            <div>
                {filteredTodos.map((todo, id) => (
                    <div className="toDoList" key={todo.id}>
                        <button className="toDoModalButton" onClick={(event) => toggleToDoModal(event, todo.id)}></button>
                        {/* Проверка toDoModalOpen на состояние открытого модального окна и соответствия selectedTodoid индексу задачи, 
                        если оба значения true то выводим модальное окно*/}
                        {toDoModalOpen && selectedTodoid === todo.id && (
                            <div className="toDoModal" style={{
                                position: 'absolute',
                                top: selectedButtonCoordinates.y,
                                left: selectedButtonCoordinates.x,
                            }}>
                                {!todo.completed && !todo.deleted && (
                                    <button className="toDoBtn" onClick={() => completeTodo(todo.id)}><img src={moveBack} alt='img' />Complete</button>
                                )}
                                {!todo.deleted && (
                                    <button className="toDoBtn" onClick={() => deleteTodo(todo.id)}><img src={trash} alt='img' />Move to Trash</button>
                                )}
                                {todo.deleted && (
                                    <>
                                        <button className="toDoBtn" onClick={() => permanentlyDeleteTodo(todo.id)}><img src={trash} alt='img' />Delete Forever</button>
                                        <button className="toDoBtn" onClick={() => restoreTodo(todo.id)}><img src={moveBack} alt='img' />Move Back To To Do</button>
                                    </>
                                )}
                            </div>
                        )}
                        <div className="checkBox">
                            <input
                                type="checkbox"
                                // Дотягиваемся до значения в todos
                                checked={todo.completed}
                                onChange={() => {
                                    if (todo.completed) {
                                        // Убираем выполнение
                                        uncompleteTodo(todo.id);
                                    } else {
                                        // Завершаем задачу
                                        completeTodo(todo.id);
                                    }
                                }}
                            />
                            <label for="completeCheckbox"></label>
                        </div>
                        <p className="toDoTask" style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.task}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;